import { describe, it, expect, beforeEach } from "vitest";
import { push, pop, size, clear, list } from "./stack.js";

describe("stack", () => {
  beforeEach(() => {
    clear();
  });

  it("starts empty", () => {
    expect(size()).toBe(0);
  });

  it("push increases size", () => {
    push("echo hello");
    expect(size()).toBe(1);
  });

  it("pop returns undefined when empty", () => {
    expect(pop()).toBeUndefined();
  });

  it("follows LIFO ordering", () => {
    push("first");
    push("second");
    push("third");
    expect(pop()).toBe("third");
    expect(pop()).toBe("second");
    expect(pop()).toBe("first");
  });

  it("pop decreases size", () => {
    push("a");
    push("b");
    pop();
    expect(size()).toBe(1);
  });

  it("clear resets the stack", () => {
    push("a");
    push("b");
    clear();
    expect(size()).toBe(0);
    expect(pop()).toBeUndefined();
  });

  describe("list", () => {
    it("returns empty array when stack is empty", () => {
      expect(list()).toEqual([]);
    });

    it("returns commands in push order", () => {
      push("first");
      push("second");
      push("third");
      expect(list()).toEqual(["first", "second", "third"]);
    });

    it("does not modify the stack", () => {
      push("a");
      push("b");
      list();
      expect(size()).toBe(2);
      expect(pop()).toBe("b");
    });

    it("returns a copy, not the internal array", () => {
      push("a");
      const result = list();
      result.push("mutated");
      expect(size()).toBe(1);
    });
  });
});
