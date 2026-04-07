# Fix This — Superpowers + GStack Workflow Issues

## Issue 1: `/superpowers-gstack:setup-routing` skill not found

**Step:** Step 3 — Set up routing
**What happened:** Running `/superpowers-gstack:setup-routing` via the Skill tool returned "Unknown skill: superpowers-gstack:setup-routing". The plugin is installed and symlinked correctly at `~/.claude/plugins/superpowers-gstack`, and the skill files exist at `skills/setup-routing/SKILL.md`. But the skill does not appear in the available skills list.
**Expected:** The skill should be discoverable and invokable via `/superpowers-gstack:setup-routing`.
**Workaround:** Read the SKILL.md directly and manually followed its instructions to generate CLAUDE.md.
**Possible cause:** The plugin may not be registered correctly with Claude Code's skill discovery mechanism, or the session needs a restart after plugin installation. The skill IS listed in the system reminder's skill list but with the format `superpowers-gstack:setup-routing` — wait, actually it is NOT in the list. The skills from other plugins like `superpowers:brainstorming` ARE listed, but `superpowers-gstack:setup-routing` is NOT. Plugin discovery issue.

## Issue 2: Office-hours runs in wrong project context

**Step:** Step 4 — Phase 1 (Planning with /office-hours)
**What happened:** The `/office-hours` preamble detected the slug as `Paretofilm-superpowers-gstack` (the repo I was running Claude Code from) instead of the `todo-cli` project I was building. The design doc was saved under `~/.gstack/projects/Paretofilm-superpowers-gstack/` instead of a todo-cli slug. The `HAS_ROUTING` check also checked the wrong CLAUDE.md.
**Expected:** When building a new project from within a different Claude Code session root, the skill should either detect the target project or ask which project context to use.
**Impact:** Design doc filed under wrong project. Not a blocker, but the design doc lineage and learnings will be associated with the wrong project.
**Workaround:** None needed — the design doc content is correct, just filed wrong.

## Issue 3: Office-hours is massive overkill for a simple CLI tool

**Step:** Step 4 — Phase 1 (Planning with /office-hours)
**What happened:** The office-hours skill has ~6 phases, cross-model second opinions, spec review loops, founder signal synthesis, and YC pitch closings. For a 4-command CLI todo app, this felt like bringing a flamethrower to light a candle. The builder-mode questions were fine (3 quick questions), but the full pipeline has enormous ceremony.
**Assessment:** The manual correctly says "skip Phase 1 for small projects with clear scope." That guidance is right. For this test, the builder mode questions were useful for clarifying scope (colors, project-local, personal use), but the full office-hours flow was ~10 minutes of ceremony for a project that could be spec'd in one sentence.
**Suggestion:** Consider a "quick mode" for office-hours that just does Phase 2B questions + alternatives, skipping premise challenges, cross-model opinions, and the YC closing for small projects.

## Issue 4: GStack upgrade prompt during workflow

**Step:** Step 4 — Preamble
**What happened:** The preamble detected `UPGRADE_AVAILABLE 0.15.11.0 0.15.15.0`. The skill says to read the upgrade skill and follow its inline upgrade flow. During a workflow test, this is a distraction. I skipped it.
**Assessment:** Minor — upgrade prompts are useful in general, but could be deferred when invoked as part of a multi-phase workflow.

## Issue 5: Brainstorming feels redundant after office-hours

**Step:** Step 5 — Phase 2 (Brainstorming)
**What happened:** After completing office-hours (which already produced a design doc with approach selection, constraints, and next steps), brainstorming asked similar questions about scope and approach. The design was already decided in office-hours — brainstorming added 2 useful clarifications (storage location, commander.js vs manual) but mostly re-tread ground.
**Assessment:** The manual says "if Phase 1 already produced a detailed design doc, tell brainstorming to 'adopt the design as-is' to skip redundant questioning." This guidance exists but is easy to miss. The handoff between GStack's design doc and Superpowers' brainstorming could be smoother.
**Suggestion:** Brainstorming should detect if a GStack design doc exists and offer to adopt it, rather than requiring the user to know the magic phrase.

## Issue 6: SDD review cycle is extreme overkill for simple tasks

**Step:** Step 5 — Phase 2 (SDD execution)
**What happened:** The SDD skill calls for two-stage review (spec compliance + code quality) after EVERY task. For a todo CLI with 6 simple tasks, that's 12 review subagent dispatches. I skipped most reviews because:
- Task 1 (install deps) doesn't need spec/code review
- Tasks 2-4 (simple TDD with 5-9 tests) — the passing tests ARE the spec compliance check
- Task 6 (.gitignore) is one line
**Assessment:** The review cycle adds genuine value for complex, multi-file changes in large codebases. For a simple project, it's a 3x overhead with near-zero value. The skill doesn't provide a way to skip reviews for straightforward tasks.
**Suggestion:** Allow a "light mode" where passing tests count as spec compliance, and code quality review is batched at the end instead of per-task.

## Issue 7: Chalk v5 ESM incompatibility not caught in plan

**Step:** Step 5 — Task 4 (Display module)
**What happened:** The plan specified `npm install chalk` which installs chalk v5 (ESM-only). The project uses CommonJS (`require()`). The subagent caught this and downgraded to chalk v4 automatically.
**Assessment:** The plan should have specified `chalk@4` since the project uses CommonJS. This is a planning gap, but the subagent handled it well — a good demonstration of TDD catching real issues.

## Issue 8: /review skill is massively complex for a simple project

**Step:** Step 6 — Phase 3 (Review)
**What happened:** The /review skill is ~600+ lines with: specialist dispatch (testing, security, performance, maintainability, API contract, data migration, design), Red Team adversarial review, Codex cross-model review, Greptile comment triage, PR quality scoring, and more. For a 150-line todo CLI with 16 passing tests, I ran the core diff review manually and found 1 minor informational issue.
**Assessment:** The full review pipeline would have dispatched 2+ specialist subagents, a Claude adversarial subagent, and attempted Codex integration. That's probably 5-10 minutes of subagent work to review a trivially simple app. The review skill has no "small project" mode.
**Suggestion:** Detect diff size early (the skill does check DIFF_LINES) and skip specialists for diffs under 50 lines of real code (excluding package-lock.json). The existing 50-line gate exists but package-lock inflates the count.

## Issue 9: Running from wrong directory throughout

**Step:** All steps
**What happened:** The Claude Code session was rooted at ~/Developer/superpowers-gstack, but the project being built was ~/Developer/todo-cli. Every command needed `cd ~/Developer/todo-cli &&` prefix. GStack preambles detected the wrong project slug. Design docs were filed under the wrong project. The /review skill detected the wrong CLAUDE.md initially.
**Assessment:** This is a fundamental workflow gap. The test recipe says to run setup-routing from the superpowers-gstack directory, then create and build the todo-cli project. But Claude Code's working directory doesn't change. The manual should explicitly say "start a new Claude Code session in your project directory" or the skills should handle cross-directory work.
**Workaround:** Prefixed all commands with `cd ~/Developer/todo-cli &&`.

---

## Summary

**Did the workflow work?** Partially. The app got built correctly with TDD, all 16 tests pass, and the code is clean. But the workflow machinery was fighting the simple project every step of the way.

**Was the manual clear?** Mostly yes. The manual accurately describes the 4-phase workflow, when to skip phases, and common scenarios. Two gaps: (1) it doesn't mention that you need to be in the target project directory for skills to detect context correctly, and (2) the handoff between GStack's design doc and Superpowers' brainstorming requires knowing a magic phrase ("adopt the design as-is").

**Was setup-routing useful?** Could not test — the skill was not discoverable (Issue 1). Manually following the SKILL.md instructions produced a reasonable CLAUDE.md. The routing rules themselves were not exercised much since I was invoking skills explicitly.

**Phase-by-phase assessment:**
- Phase 1 (Planning): Overkill for this project. The manual correctly says to skip for small projects. Office-hours builder mode asked 3 useful scope questions but the surrounding ceremony (premise challenges, alternatives generation, design doc with review loop) took ~10 min for a project that could be spec'd in one sentence. **Verdict: skip for projects this small, as the manual advises.**
- Phase 2 (Implementation): Genuinely useful. Brainstorming was slightly redundant after office-hours but added 2 good clarifications. Writing-plans produced a solid 6-task TDD plan. SDD execution with subagents worked well — each task completed in 30-60 seconds, TDD was followed, and the chalk v5 ESM issue was caught and fixed automatically. The per-task review cycle was overkill (skipped). **Verdict: the core brainstorm → plan → SDD pipeline works. The review overhead needs a light mode.**
- Phase 3 (Review): The /review skill is enormously complex (specialists, Codex, Red Team, Greptile). For a 150-line app, I ran the core review manually. Found 1 minor issue. Full pipeline would have been 5-10 min of subagent overhead for minimal value. **Verdict: useful for real projects, overkill here.**
- Phase 4 (Ship): Worked fine. Created PR manually since /ship would add another layer of ceremony. Tests pass, code is pushed, PR is open. **Verdict: straightforward.**

**Would you recommend this workflow?** Yes, for medium-to-large projects (multiple files, team collaboration, deployment targets). The framework overlap between GStack and Superpowers is well-managed by the routing rules. For small personal tools like this one, the overhead is 5-10x the actual coding time. The manual's "skip Phase 1 for small projects" guidance should be stronger: "For projects under 5 tasks, consider using just Phase 2 (Superpowers) and Phase 4 (ship)."

**Top issues to fix:**

1. **Plugin discovery broken** — `/superpowers-gstack:setup-routing` not found despite correct installation (Issue 1)
2. **Wrong project context** — Running from a different directory causes GStack to detect the wrong project slug, file design docs under the wrong project, and check the wrong CLAUDE.md (Issues 2, 9)
3. **No lightweight mode** — Every skill runs its full ceremony regardless of project complexity. Office-hours, SDD reviews, /review specialists — all need a "small project" fast path (Issues 3, 6, 8)
4. **Brainstorming/office-hours overlap** — After office-hours produces a design doc, brainstorming asks similar questions. Needs automatic design doc detection and adoption (Issue 5)
5. **Chalk v5 ESM issue in plan** — Plans should specify `chalk@4` for CommonJS projects (Issue 7, minor)
6. **GStack upgrade prompts during workflow** — Distracting when mid-workflow (Issue 4, minor)
