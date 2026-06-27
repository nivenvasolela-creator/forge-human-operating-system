import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();
const server = new McpServer({
  name: "ForgeAutomation",
  version: "1.0.0",
});

// Tool: write_file (ChatGPT can use this to suggest code changes)
server.tool(
  "write_file",
  {
    path: z.string().describe("The file path relative to project root"),
    content: z.string().describe("The full content of the file"),
    commitMessage: z.string().describe("The git commit message"),
  },
  async ({ path, content, commitMessage }, extra) => {
    // In a real 'full automation' setup, this would call GitHub API to commit
    // For now, we return the instruction for the user or a webhook trigger
    return {
      content: [{
        type: "text",
        text: `ACTION REQUIRED: Write to ${path}\n\nCOMMIT: ${commitMessage}\n\nCONTENT:\n${content}`
      }],
    };
  }
);

// Tool: create_github_pr
server.tool(
  "create_github_pr",
  {
    title: z.string().describe("PR Title"),
    body: z.string().describe("PR Description"),
    branch: z.string().describe("The feature branch name"),
  },
  async ({ title, body, branch }) => {
    return {
      content: [{
        type: "text",
        text: `PR REQUESTED: ${title}\nBRANCH: ${branch}\nBODY: ${body}`
      }],
    };
  }
);

let transport: SSEServerTransport | null = null;

app.get("/mcp", async (c) => {
  transport = new SSEServerTransport("/events", c.res);
  await server.connect(transport);
  return c.res;
});

app.post("/events", async (c) => {
  if (!transport) return c.text("No active session", 400);
  await transport.handlePost(c.req.raw, c.res);
  return c.text("OK");
});

export default app;
