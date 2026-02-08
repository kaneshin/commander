import { describe, it, expect, beforeEach } from "vitest";
import app from "./index.js";
import { clear } from "./stack.js";

describe("POST /commands", () => {
  beforeEach(() => {
    clear();
  });

  it("pushes a command and returns 201", async () => {
    const res = await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "echo hello" }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.message).toBe("Command pushed");
    expect(body.size).toBe(1);
  });

  it("returns 400 for missing command", async () => {
    const res = await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-string command", async () => {
    const res = await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: 123 }),
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /commands/execute", () => {
  beforeEach(() => {
    clear();
  });

  it("returns 404 when stack is empty", async () => {
    const res = await app.request("/commands/execute", { method: "POST" });
    expect(res.status).toBe(404);
  });

  it("pops and executes the top command", async () => {
    await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "echo hello" }),
    });

    const res = await app.request("/commands/execute", { method: "POST" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.command).toBe("echo hello");
    expect(body.stdout.trim()).toBe("hello");
  });

  it("follows LIFO order", async () => {
    await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "echo first" }),
    });
    await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "echo second" }),
    });

    const res = await app.request("/commands/execute", { method: "POST" });
    const body = await res.json();
    expect(body.command).toBe("echo second");
    expect(body.stdout.trim()).toBe("second");
  });

  it("returns 500 on command failure", async () => {
    await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "exit 1" }),
    });

    const res = await app.request("/commands/execute", { method: "POST" });
    expect(res.status).toBe(500);
  });
});

describe("GET /commands", () => {
  beforeEach(() => {
    clear();
  });

  it("returns empty list when stack is empty", async () => {
    const res = await app.request("/commands");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ commands: [], size: 0 });
  });

  it("returns pushed commands", async () => {
    await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "echo first" }),
    });
    await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "echo second" }),
    });

    const res = await app.request("/commands");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      commands: ["echo first", "echo second"],
      size: 2,
    });
  });

  it("reflects state after execute", async () => {
    await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "echo first" }),
    });
    await app.request("/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "echo second" }),
    });

    await app.request("/commands/execute", { method: "POST" });

    const res = await app.request("/commands");
    const body = await res.json();
    expect(body).toEqual({ commands: ["echo first"], size: 1 });
  });
});
