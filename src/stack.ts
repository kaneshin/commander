const commands: string[] = [];

export function push(command: string): void {
  commands.push(command);
}

export function pop(): string | undefined {
  return commands.pop();
}

export function size(): number {
  return commands.length;
}

export function list(): string[] {
  return [...commands];
}

export function clear(): void {
  commands.length = 0;
}
