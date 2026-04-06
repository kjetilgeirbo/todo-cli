# Fix This — Superpowers + GStack Workflow Issues

## Issue 1: `/superpowers-gstack:setup-routing` skill not found

**Step:** Step 3 — Set up routing
**What happened:** Running `/superpowers-gstack:setup-routing` via the Skill tool returned "Unknown skill: superpowers-gstack:setup-routing". The plugin is installed and symlinked correctly at `~/.claude/plugins/superpowers-gstack`, and the skill files exist at `skills/setup-routing/SKILL.md`. But the skill does not appear in the available skills list.
**Expected:** The skill should be discoverable and invokable via `/superpowers-gstack:setup-routing`.
**Workaround:** Read the SKILL.md directly and manually followed its instructions to generate CLAUDE.md.
**Possible cause:** The plugin may not be registered correctly with Claude Code's skill discovery mechanism, or the session needs a restart after plugin installation. The skill IS listed in the system reminder's skill list but with the format `superpowers-gstack:setup-routing` — wait, actually it is NOT in the list. The skills from other plugins like `superpowers:brainstorming` ARE listed, but `superpowers-gstack:setup-routing` is NOT. Plugin discovery issue.
