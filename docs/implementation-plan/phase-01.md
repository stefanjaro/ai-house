# Phase 01 — Project Scaffold

**Status:** `[DONE]` — Completed 2026-03-14. 15 tests pass (5 game-config, 10 api-config-template).
**Goal:** Get a Phaser 3 game running in your browser with zero game content — just proof that the stack works.

---

## What You'll Be Able to Test

After this phase, running `npm run dev` in the `ai-house/` folder will open a browser tab showing a Phaser canvas with a solid-coloured background (placeholder). No game content yet — just the engine running.

---

## What Gets Built

### 1. Directory structure

```
ai-house/
├── src/
│   └── main.js              ← Phaser game entry point
├── index.html               ← Single HTML file that loads the game
├── vite.config.js           ← Vite build config
├── package.json
└── setup.md                 ← Instructions for anyone cloning the repo
```

The full target directory structure (with all future folders) will be created as empty placeholders with `.gitkeep` files so the structure is visible from the start.

### 2. Phaser 3 initialisation

`main.js` initialises a Phaser `Game` instance with:
- A single placeholder `Scene` that renders a background colour
- Canvas size: 960×640px (fits most laptop screens, 3:2 ratio, good for a 4-room house layout)
- Pixel art rendering mode enabled (`pixelArt: true`, `antialias: false`) — critical for crisp sprites

### 3. Vite config

- Serves the game at `localhost:5173`
- Handles asset loading from the `assets/` folder

### 4. `setup.md`

Instructions covering:
- Prerequisites (Node.js version)
- How to clone and install
- How to run the dev server
- How to fill in `config/api-config.json`
- Where to find generated conversation logs

### 5. `config/api-config.template.json`

A committed template showing the expected shape of the API config. The actual `api-config.json` is gitignored.

```json
{
  "husband": {
    "apiKey": "YOUR_API_KEY",
    "endpoint": "https://your-api-endpoint/v1/chat/completions",
    "model": "your-model-name"
  },
  "wife": {
    "apiKey": "YOUR_API_KEY",
    "endpoint": "https://your-api-endpoint/v1/chat/completions",
    "model": "your-model-name"
  },
  "poltergeist": {
    "apiKey": "YOUR_API_KEY",
    "endpoint": "https://your-api-endpoint/v1/chat/completions",
    "model": "your-model-name"
  }
}
```

---

## Your Actions Required

1. **Install Node.js** (if not already): download from https://nodejs.org — install the LTS version.
   - Verify: run `node -v` in your terminal. Should print something like `v20.x.x`.
2. After I build this phase, run:
   ```bash
   cd ai-house
   npm install
   npm run dev
   ```
3. Open the URL shown in your terminal (usually `http://localhost:5173`) in your browser.
4. Confirm you see a coloured canvas — that's the test passing.

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `phaser` | `^3.60.0` | Game engine |
| `vite` | `^5.0.0` | Dev server and bundler |

---

## Divergences from Original Spec

_None._
