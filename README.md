# Commander

A Hono + Vite server that manages an in-memory LIFO stack of shell commands. Push commands onto the stack via HTTP, then pop and execute them on demand.

## Setup

```bash
npm install
```

## Usage

### Dev server

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:3333` with HMR.

### Tests

```bash
npm test            # single run
npm run test:watch  # watch mode
```

## API

### `GET /commands`

List all commands currently on the stack.

**Response** `200`

```json
{ "commands": ["echo hello", "ls"], "size": 2 }
```

### `POST /commands`

Push a shell command onto the stack.

**Request**

```json
{ "command": "echo hello" }
```

**Response** `201`

```json
{ "message": "Command pushed", "size": 1 }
```

**Error** `400` — missing or non-string `command` field.

### `DELETE /commands`

Clear all commands from the stack.

**Response** `204` No Content

### `POST /commands/execute`

Pop the most recent command from the stack and execute it.

**Response** `200`

```json
{ "command": "echo hello", "stdout": "hello\n", "stderr": "" }
```

**Errors**

- `404` — stack is empty
- `500` — command exited with non-zero status

## Example

```bash
# Push two commands
curl -X POST http://localhost:3333/commands \
  -H 'Content-Type: application/json' \
  -d '{"command":"echo hello"}'

curl -X POST http://localhost:3333/commands \
  -H 'Content-Type: application/json' \
  -d '{"command":"ls"}'

# List current stack
curl http://localhost:3333/commands

# Execute — pops "ls" first (LIFO)
curl -X POST http://localhost:3333/commands/execute

# Clear all commands
curl -X DELETE http://localhost:3333/commands
```

## Project Structure

```
src/
├── index.ts          # Hono app with routes (default export)
├── index.test.ts     # Route integration tests
├── stack.ts          # LIFO stack (push, pop, size, list, clear)
├── stack.test.ts     # Stack unit tests
├── executor.ts       # Shell command executor (10s timeout)
└── executor.test.ts  # Executor unit tests
```
