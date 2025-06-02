# AI Trends Remote MCP Server on Cloudflare (Without Auth)

This MCP server provides tools to interact with AI trends data. It includes two main functions:

- **get_latest_trends**: Retrieves the latest AI trends (daily, weekly, and monthly)
- **ask_trends**: Answers queries based on the curated AI trends dataset

To add your own [tools](https://developers.cloudflare.com/agents/model-context-protocol/tools/) to the MCP server, define each tool inside the `init()` method of `src/index.ts` using `this.server.tool(...)`.
