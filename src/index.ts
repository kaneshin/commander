import { Hono } from "hono";
import { push, pop, size, list } from "./stack.js";
import { execute } from "./executor.js";

const app = new Hono();

app.get("/commands", (c) => {
  return c.json({ commands: list(), size: size() });
});

app.post("/commands", async (c) => {
  const body = await c.req.json();
  if (typeof body.command !== "string" || body.command.length === 0) {
    return c.json({ error: "Invalid command" }, 400);
  }
  push(body.command);
  return c.json({ message: "Command pushed", size: size() }, 201);
});

app.post("/commands/execute", async (c) => {
  const command = pop();
  if (command === undefined) {
    return c.json({ error: "Stack is empty" }, 404);
  }
  try {
    const result = await execute(command);
    return c.json({ command, stdout: result.stdout, stderr: result.stderr });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: message, command }, 500);
  }
});

export default app;
