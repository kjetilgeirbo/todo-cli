# Todo CLI

## Skill routing

This project uses Superpowers + GStack. Each owns a distinct phase:

### GStack — Review and Shipping

**Review & QA:**
- `/review` — pre-merge code review

**Ship & Monitor:**
- `/ship` — create PR and deploy

### Superpowers — Implementation
- `/superpowers:brainstorming` — technical approach
- `/superpowers:writing-plans` — TDD task breakdown
- `/superpowers:executing-plans` — inline execution with checkpoints (small project)
- `/superpowers:systematic-debugging` — root cause analysis
- `/superpowers:test-driven-development` — TDD enforcement
- `/superpowers:verification-before-completion` — verify before claiming done
- `/superpowers:receiving-code-review` — handle review feedback

### Routing Logic
New feature idea     → /office-hours
Ready to build       → /superpowers:brainstorming
Bug fix              → /superpowers:systematic-debugging
Code complete        → /review
Review feedback?     → /superpowers:receiving-code-review → fix → /review again
Ready to ship        → /ship
Trivial change       → Just do it

### Rules
- Never run GStack and Superpowers skills in the same phase
- Use `/superpowers:systematic-debugging` for bugs found during implementation
- Superpowers specs go in `docs/superpowers/`
- GStack state lives in `~/.gstack/projects/`

### Session Management
- Skip `/clear` for this project (< 5 tasks, < 30 min)

## Project

### Tech Stack
- Node.js CLI tool
- JSON file storage

### Testing
- Framework: Jest
- Run: `npm test`
