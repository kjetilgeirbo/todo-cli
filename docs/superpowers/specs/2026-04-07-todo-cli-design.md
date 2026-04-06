# Todo CLI — Design Spec

## Overview
A simple, satisfying CLI todo app for personal use. 4 commands (add, list, done, delete), colored terminal output with completion stats, JSON file storage.

## Architecture

### Modules

| File | Responsibility |
|------|---------------|
| `src/todo.js` | Pure data functions: load, save, add, list, markDone, delete |
| `src/display.js` | Formatting: colored output with chalk, completion stats, checkmarks |
| `src/cli.js` | Commander.js setup, wires commands to todo.js + display.js |
| `index.js` | Entry point: requires and runs cli.js |

### Data Model

File: `./todos.json` (created automatically on first add)

```json
[
  {
    "id": 1,
    "text": "Buy milk",
    "done": false,
    "createdAt": "2026-04-07T01:00:00.000Z"
  }
]
```

- `id`: Auto-incrementing integer (max existing id + 1)
- `text`: String, the todo item text
- `done`: Boolean, false by default
- `createdAt`: ISO 8601 timestamp

### Commands

| Command | Behavior |
|---------|----------|
| `node index.js add "Buy milk"` | Creates todo, prints green confirmation with id |
| `node index.js list` | Shows all todos with checkmarks (done) or bullets (pending), completion stats at bottom |
| `node index.js done <id>` | Marks todo as done, prints green checkmark confirmation |
| `node index.js delete <id>` | Removes todo from list, prints confirmation |

### Display Format

**List output:**
```
  1. [ ] Buy milk
  2. [x] Walk the dog
  3. [ ] Write tests

  Progress: 1/3 done (33%)
```

- Pending items: white text with `[ ]`
- Done items: green text with `[x]`, dimmed/strikethrough
- Progress line at bottom with percentage

**Add confirmation:** `Added: "Buy milk" (#1)`
**Done confirmation:** `Done: "Walk the dog" (#2)`
**Delete confirmation:** `Deleted: "Walk the dog" (#2)`
**Error (not found):** `Error: Todo #99 not found`
**Empty list:** `No todos yet. Add one with: node index.js add "your task"`

### Error Handling

- Missing todos.json on list/done/delete: treat as empty array
- Invalid id (not found): print error message, exit code 1
- Missing text on add: commander.js handles required arg validation

## Dependencies

- `commander` — CLI argument parsing
- `chalk` — Terminal colors
- `jest` (dev) — Testing

## Testing

| Test file | Covers |
|-----------|--------|
| `tests/todo.test.js` | All data operations: add, list, markDone, delete, file I/O with temp files |
| `tests/display.test.js` | Output formatting: list format, confirmations, empty state, progress stats |

Each test uses a temporary file path to avoid polluting the working directory.

## Success Criteria

- All 4 commands work correctly
- Colored output with completion stats
- All tests pass
- File is created/updated atomically (write then rename, or just writeFileSync for simplicity)
