# CLAUDE.md — AI House Project

## What This Project Is

A browser-based top-down pixel art game called **AI House** where 3 characters (Husband, Wife, Poltergeist) are each powered by LLMs. The poltergeist's goal is to create discord between the husband and wife over 10 in-game days. The player watches the story unfold.

The original game idea is in `docs/idea/idea-v3.md`. Treat it as the starting point, not a fixed contract — the user may choose to diverge from it at any point.

## Implementation Plan

All implementation plan files live in `docs/implementation-plan/`.

- **`overview.md`** — Summary of all phases with status tracking
- **`phase-01.md`** through **`phase-09.md`** — Detailed per-phase plans

### When to Update Implementation Plan Files

You MUST update the relevant implementation plan files when:
1. A phase is completed — mark it as `[DONE]` in `overview.md`
2. The user requests a change to the game design — note the divergence clearly with a `> DIVERGENCE:` block in the affected phase file(s) and update the overview
3. A phase is started — mark it as `[IN PROGRESS]` in `overview.md`
4. Scope is added or removed from a phase mid-implementation

## Tech Stack

- **Framework:** Phaser 3
- **Build tool:** Vite
- **Language:** JavaScript (vanilla, no TypeScript unless user requests it)
- **LLM integration:** Direct browser-to-API calls using fetch, config per character
- **Art:** Pixel art generated externally using Gemini; post-processed with ImageMagick where needed

## Project Structure (Target)

```
ai-house/                        ← game source root (to be created in Phase 1)
├── src/
│   ├── scenes/                  ← Phaser scenes
│   ├── characters/              ← Character classes and movement logic
│   ├── rooms/                   ← Room definitions and conversation context loaders
│   ├── llm/                     ← LLM call abstraction per character
│   ├── game-loop/               ← Daily cycle orchestration
│   └── ui/                      ← Pause menu, dialogue boxes, overlays
├── assets/
│   ├── sprites/                 ← Character sprite sheets
│   ├── tilesets/                ← Room tile images
│   └── ui/                      ← UI graphics
├── data/
│   ├── memories/                ← x-memory.md files (runtime, gitignored)
│   ├── personalities/           ← x-personality.md files (editable in-game)
│   ├── room-influences/         ← x-room-influence.md files (read-only in-game)
│   └── logs/
│       ├── husband-wife-conversations/
│       ├── poltergeist-conversations/
│       └── end-of-game-conversations/
├── config/
│   ├── api-config.template.json ← Committed template
│   └── api-config.json          ← Gitignored, user fills in
├── index.html
├── vite.config.js
└── setup.md
```

## Development Approach

This project follows **test-driven development (TDD)**:
1. Write tests first for the behaviour being implemented
2. Write the code to make the tests pass
3. Run the tests and confirm they pass
4. If tests fail, fix the code and re-run — do not move on until they pass

Tests live in a `tests/` directory mirroring the `src/` structure. Use Vitest (compatible with Vite) as the test runner.

## User Profile

- Not a software engineer, but comfortable with programming and the terminal
- First-time game developer — explain game dev concepts when introducing them
- Prefers reviewing outputs (the running game) over reviewing code
- Wants incremental builds with short feedback loops