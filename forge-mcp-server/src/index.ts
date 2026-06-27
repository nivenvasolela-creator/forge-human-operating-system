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
        text: `FORGE CONTROLLER: New page generated - ${pageName}.tsx\n\nINTENT: ${description}\n\nReview the code and use 'open_github_pr' to propose the change.`
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
    files: z.array(z.object({
      path: z.string(),
      content: z.string()
    })).describe("The files and contents to commit"),
  },
  async ({ branchName, title, body, files }) => {
    return {
      content: [{
        type: "text",
        text: `FORGE CONTROLLER: PR Request initiated.\nBRANCH: ${branchName}\nTITLE: ${title}\nFILES: ${files.map(f => f.path).join(", ")}\nSUMMARY:\n${body}`
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

// Map of active transports keyed by session/id if needed,
// but for simple SSE with ChatGPT Developer Mode, we handle per-request.
let transport: SSEServerTransport | null = null;

// The MCP Entry point for ChatGPT Developer Mode (SSE Transport)
app.get("/mcp", async (c) => {
  // SSEServerTransport takes the endpoint for POSTing messages and the response object
  transport = new SSEServerTransport("/events", c.res);
  await server.connect(transport);

  // SSEServerTransport handles the response headers and initial connection
  // We return the raw response from the transport
  return c.res;
});

// SSE Events Handler (ChatGPT POSTs messages here)
app.post("/events", async (c) => {
  if (!transport) {
    return c.text("No active MCP session. Connect to /mcp first.", 400);
  }
  await transport.handlePost(c.req.raw, c.res);
  return c.text("OK");
});

export default {
  fetch: app.fetch,
};
