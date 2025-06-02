import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "AI Trends MCP Server",
		version: "1.0.0",
	});

	async init() {
		const API_URL = "https://aitrends3-635306595374.europe-west1.run.app";

		// Get latest AI trends tool
		this.server.tool(
			"get_latest_trends",
			{},
			async () => {
				try {
					const response = await fetch(API_URL, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-Client-UID": "user123456",
						},
						body: JSON.stringify({ action: "get_latest_trends" }),
					});

					if (!response.ok) {
						throw new Error(`API request failed: ${response.status}`);
					}

					const data = await response.json();
					return {
						content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
					};
				} catch (error) {
					return {
						content: [{ type: "text", text: `Error: ${error.message}` }],
					};
				}
			}
		);

		// Ask about specific AI trends tool
		this.server.tool(
			"ask_trends",
			{
				query: z.string().describe("The question to ask about AI trends"),
			},
			async ({ query }) => {
				try {
					const response = await fetch(API_URL, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-Client-UID": "user123456",
						},
						body: JSON.stringify({ action: "ask_trends", query }),
					});

					if (!response.ok) {
						throw new Error(`API request failed: ${response.status}`);
					}

					const data = await response.json();
					return {
						content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
					};
				} catch (error) {
					return {
						content: [{ type: "text", text: `Error: ${error.message}` }],
					};
				}
			}
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
