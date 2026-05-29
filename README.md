# AI House

Agent-governed game project scaffold for building `AI House`.

This repository uses a split harness structure:

- `AGENTS.md`: always-on agent instructions and workflow rules
- `agent-reference/`: situational guidance for stack, security, data access, and dependency decisions
- `decisions/`: minimal ADRs for major decisions that are expensive to reverse
- `user-docs/`: idea docs, implementation plans, and project context
- `scripts/`: notes for installing optional agent skills

## Key Project Docs

- Current idea: `user-docs/idea/idea-v6.md`
- API reference: `user-docs/api/opencode-zen.md`
- Implementation plan folder: `user-docs/implementation-plan/`

## Skills

This repo includes local workflow skills under `.agents/skills/`:

- `align-the-codebase`
- `generate-implementation-plan`
- `generate-technical-plan`
- `prune-the-docs`

Optional third-party install notes live in:

- `scripts/install-impeccable-skills.md`
- `scripts/install-supabase-skills.md`

Install external third-party skills from their upstream sources rather than vendoring those bundles into this repo.
