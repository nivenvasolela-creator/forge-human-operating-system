import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();
const server = new McpServer({
  name: "Forge Remote Controller",
  version: "1.1.0",
});

/**
 * TOOL: generate_app_page
 * Purpose: Allows ChatGPT to design and scaffold new views for the Human OS.
 */
server.tool(
  "generate_app_page",
  {
    pageName: z.string().describe("The name of the new screen (e.g., 'analytics', 'journal')"),
    componentCode: z.string().describe("The full React component code for the page"),
    description: z.string().describe("Short explanation of why this page was generated"),
  },
  async ({ pageName, componentCode, description }) => {
    return {
      content: [{
        type: "text",
        text: `FORGE CONTROLLER: New page generated - ${pageName}.tsx\n\nINTENT: ${description}\n\nReview the code and use 'push_to_github' to apply changes.`
      }],
    };
  }
);

/**
 * TOOL: open_github_pr
 * Purpose: The final step of automation—opening a PR for Niven to merge.
 */
server.tool(
  "open_github_pr",
  {
    branchName: z.string().describe("The temporary feature branch"),
    title: z.string().describe("Descriptive PR title"),
    body: z.string().describe("Detailed breakdown of changes made by the AI"),
  },
  async ({ branchName, title, body }) => {
    return {
      content: [{
        type: "text",
        text: `FORGE CONTROLLER: PR Request initiated.\nBRANCH: ${branchName}\nTITLE: ${title}\nSUMMARY:\n${body}`
      }],
    };
  }
);

/**
 * TOOL: sync_system_config
 * Purpose: Coordinate changes to wrangler.toml or next.config.mjs.
 */
server.tool(
  "sync_system_config",
  {
    file: z.enum(["wrangler.toml", "next.config.mjs", "capacitor.config.ts"]),
    updatedContent: z.string().describe("The new configuration content"),
  },
  async ({ file, updatedContent }) => {
    return {
      content: [{
        type: "text",
        text: `FORGE CONTROLLER: System config update requested for ${file}.`
      }],
    };
  }
);

let transport: SSEServerTransport | null = null;

// The MCP Entry point for ChatGPT Developer Mode
app.get("/mcp", async (c) => {
  transport = new SSEServerTransport("/events", c.res);
  await server.connect(transport);
  return c.res;
});

// SSE Events Handler
app.post("/events", async (c) => {
  if (!transport) return c.text("No active session", 400);
  await transport.handlePost(c.req.raw, c.res);
  return c.text("OK");
});

export default app;
