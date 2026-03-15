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

## File Map

```
ai-village/
├── server.js                          # Express server — all file I/O endpoints (/api/*)
├── config.json                        # Git-ignored; user fills in from config.template.json
├── src/
│   ├── main.js                        # Entry point — screen router, loads config+personalities
│   ├── styles/main.css                # All styles (CSS variables, per-screen sections)
│   ├── engine/                        # Pure game logic — no DOM, no side effects
│   │   ├── dayManager.js              # Day progression, phase transitions
│   │   ├── randomSelector.js          # Weighted random selection helpers
│   │   ├── conversationEngine.js      # Builds LLM prompts from state + memory
│   │   └── memoryEngine.js            # Parses and updates memory markdown
│   ├── services/                      # Side-effect layers (I/O, LLM)
│   │   ├── fileService.js             # HTTP client for all /api/* endpoints
│   │   ├── llmService.js              # Streaming OpenAI-compatible LLM calls
│   │   ├── memoryService.js           # Orchestrates memory read/update cycle
│   │   ├── conversationOrchestrator.js# Runs a full husband↔wife or poltergeist exchange
│   │   └── diabolicalPlanner.js       # Generates the poltergeist's hidden agenda
│   └── ui/
│       ├── screens/
│       │   ├── startScreen.js         # Title screen — "New Game" button
│       │   ├── characterCreationScreen.js # Name + personality editor; 3-character cards
│       │   ├── gameScreen.js          # Main game layout (topBar + centerScreen + historyPanel + bottomBar)
│       │   └── endScreen.js           # End-of-game summary
│       └── components/
│           ├── topBar.js              # Day counter header
│           ├── centerScreen.js        # Room background + sprites + conversation overlay
│           ├── historyPanel.js        # Right-side conversation log panel
│           ├── bottomBar.js           # Character cards with action buttons
│           └── speechBubble.js        # In-scene dialogue bubble
├── tests/
│   ├── engine/                        # Unit tests — dayManager, randomSelector, conversationEngine, memoryEngine
│   ├── services/                      # Integration tests — fileService, llmService, memoryService, orchestrators
│   └── ui/                            # jsdom tests — characterCreationScreen
├── data/                              # Runtime data (git-ignored except templates)
│   ├── husband-wife-conversations/    # Saved couple conversation logs (markdown)
│   ├── poltergeist-conversations/     # Saved poltergeist conversation logs (markdown)
│   ├── end-of-game-conversations/     # Final summary logs
│   ├── memory/                        # husband-memory.md, wife-memory.md, poltergeist-memory.md
│   ├── personalities/                 # husband-personality.md, wife-personality.md, poltergeist-personality.md
│   └── room-influence/                # bedroom.md, kitchen.md, living-room.md, mystery-room.md
└── public/assets/
    ├── rooms/                         # Room background images
    ├── sprites/                       # Character sprite images (husband.png, wife.png, poltergeist.png)
    └── ui/                            # Parchment textures, borders
```

## Key Conventions
- Conversation logs → `data/husband-wife-conversations/` and `data/poltergeist-conversations/`
- End-of-game logs → `data/end-of-game-conversations/`
- Memory files → `data/memory/husband-memory.md`, `data/memory/wife-memory.md`, `data/memory/poltergeist-memory.md`
- Personality files → `data/personalities/husband-personality.md`, `data/personalities/wife-personality.md`, `data/personalities/poltergeist-personality.md`
- Room influence files → `data/room-influence/bedroom.md`, `data/room-influence/kitchen.md`, `data/room-influence/living-room.md`, `data/room-influence/mystery-room.md`
- Config → `config.json` (copied from `config.template.json` by the user)
- Static assets → `public/assets/` (rooms, sprites, UI textures)
- UI test environment: `// @vitest-environment jsdom` at the top of test files in `tests/ui/`
