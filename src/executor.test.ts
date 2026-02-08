import { describe, it, expect } from "vitest";
import { execute } from "./executor.js";

describe("executor", () => {
  it("captures stdout from a successful command", async () => {
    const result = await execute("echo hello");
    expect(result.stdout.trim()).toBe("hello");
    expect(result.stderr).toBe("");
  });

  it("captures stderr", async () => {
    const result = await execute("echo err >&2");
    expect(result.stderr.trim()).toBe("err");
  });

  it("rejects on command failure", async () => {
    await expect(execute("exit 1")).rejects.toThrow();
  });

  it("rejects on unknown command", async () => {
    await expect(execute("__nonexistent_cmd__")).rejects.toThrow();
  });
});
