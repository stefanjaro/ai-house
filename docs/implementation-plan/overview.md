# AI House — Implementation Plan Overview

Full game design spec: `docs/idea/idea-v4.md`

## Phase Status

| Phase | Name | Status |
|-------|------|--------|
| 00 | Asset Specification & Generation | DONE |
| 01 | Project Setup | DONE |
| 02 | Config & Content Files | DONE |
| 03 | Game Logic Engine | DONE |
| 04 | File System Service | DONE |
| 05 | LLM Service & Conversation Engine | DONE |
| 06 | Memory System | DONE |
| 07 | UI Shell & Medieval Styling | DONE |
| 08 | Character Creation Screen | DONE |
| 09 | Center Screen — Day Activities | DONE |
| 10 | History Panel | TODO |
| 11 | End Game Sequence | TODO |
| 12 | Sound | TODO |

## Architecture Overview

```
ai-village/
├── CLAUDE.md
├── config.template.json       # Users copy this to config.json and fill it in
├── config.json                # Git-ignored; user's actual API keys/models
├── package.json
├── vite.config.js
├── server.js                  # Express local server (file I/O only)
├── public/
│   └── assets/
│       ├── rooms/             # Room background images
│       ├── sprites/           # Character sprite images
│       └── ui/                # Parchment textures, borders, etc.
├── src/
│   ├── main.js                # Vite entry point
│   ├── engine/                # Pure game logic (no DOM, fully testable)
│   │   ├── dayManager.js
│   │   ├── randomSelector.js
│   │   ├── conversationEngine.js
│   │   └── memoryEngine.js
│   ├── services/              # Side-effect layers
│   │   ├── llmService.js      # Streaming LLM calls
│   │   └── fileService.js     # Calls to Express endpoints
│   ├── ui/                    # DOM/rendering code
│   │   ├── screens/
│   │   │   ├── startScreen.js
│   │   │   ├── characterCreationScreen.js
│   │   │   ├── gameScreen.js
│   │   │   └── endScreen.js
│   │   └── components/
│   │       ├── centerScreen.js
│   │       ├── historyPanel.js
│   │       ├── topBar.js
│   │       ├── bottomBar.js
│   │       └── speechBubble.js
│   └── styles/
│       └── main.css
├── tests/
│   ├── engine/
│   └── services/
└── data/                      # Runtime data (git-ignored except templates)
    ├── husband-wife-conversations/
    ├── poltergeist-conversations/
    ├── end-of-game-conversations/
    ├── memory/
    ├── personalities/
    └── room-influence/
```

## Notes
- Phase 00 originally used user-generated Gemini images, but the current visual direction now uses repo-native SVG artwork for rooms, sprites, and UI textures.
- No deployment — this runs locally via `npm run dev` (Vite) + `npm run server` (Express) simultaneously.
- Sound is deliberately last (Phase 12).
