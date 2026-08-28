@AGENTS.md

# Claude Code notes

- Project skills live in `.claude/skills/<name>/SKILL.md`; they auto-load by
  description and can be invoked as `/<name>`.
- **Generated — never hand-edit:** `.github/copilot-instructions.md`,
  `.github/instructions/*.instructions.md`, `.github/prompts/*.prompt.md`.
  They are produced from `AGENTS.md` and `.claude/skills/*/SKILL.md`.
  After changing a source, run `npm run sync:agents` (see the
  `agent-instructions` skill).
