import { exec } from "node:child_process";

export interface ExecResult {
  stdout: string;
  stderr: string;
}

// exec() is intentional — this app's purpose is to run arbitrary shell commands
export function execute(command: string): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 10_000 }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}
