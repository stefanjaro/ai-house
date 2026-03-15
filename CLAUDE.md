# CLAUDE.md — AI House Project

## What This Project Is
A browser-based narrative game called **AI House**. See `docs/idea/idea-v4.md` for the full game design spec.

## Tech Stack
- **Frontend:** Vite + vanilla JavaScript
- **Backend:** Node.js + Express (local only — needed for file system access: conversation logs, memory files)
- **Testing:** Vitest (TDD — always write tests before implementation code)
- **LLM:** Direct streaming calls to OpenAI-compatible endpoints from the frontend. Config via `config.json`.

## Implementation Plan
All phase files live in `docs/implementation-plan/`:
- `overview.md` — phase table, status at a glance, and overall architecture
- `phase-00.md` through `phase-11.md` — one file per phase

**When to update implementation plan files:**
- When a phase is started: mark it `IN PROGRESS`
- When a phase is complete: mark it `DONE` and fill in the completion date
- When the design changes from the original spec: add a `> **DIVERGENCE:**` block in the relevant phase file explaining what changed and why
- When a new phase is needed: add it to overview.md and create its file

## TDD Rule
Write tests first using Vitest. Tests must pass before moving to the next phase. Never write implementation code before the tests for it exist.

## API Reference
- `docs/api/opencode-zen.md` — request/response format for the OpenCode Zen endpoint (OpenAI-compatible). Used when implementing `llmService.js` in Phase 05. Note: thinking models return a `reasoning_content` field in addition to `content` — only `content` should be streamed to the UI.

## Key Conventions
- Conversation logs → `data/husband-wife-conversations/` and `data/poltergeist-conversations/`
- End-of-game logs → `data/end-of-game-conversations/`
- Memory files → `data/memory/husband-memory.md`, `data/memory/wife-memory.md`, `data/memory/poltergeist-memory.md`
- Personality files → `data/personalities/husband-personality.md`, `data/personalities/wife-personality.md`, `data/personalities/poltergeist-personality.md`
- Room influence files → `data/room-influence/bedroom.md`, `data/room-influence/kitchen.md`, `data/room-influence/living-room.md`, `data/room-influence/mystery-room.md`
- Config → `config.json` (copied from `config.template.json` by the user)
- Static assets → `public/assets/` (rooms, sprites, UI textures)
