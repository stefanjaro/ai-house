# AI House — Implementation Plan Overview

> This file tracks all phases of development. Update phase status as work progresses.
> Full game spec: `docs/idea/idea-v3.md`
> Detailed phase files: `docs/implementation-plan/phase-XX.md`

## Phase Status

| Phase | Title | Status |
|-------|-------|--------|
| 01 | Project Scaffold | `[ ] TODO` |
| 02 | World Layout & Character Movement | `[ ] TODO` |
| 03 | Character Creation Screen | `[ ] TODO` |
| 04 | LLM Integration & Conversation Engine | `[ ] TODO` |
| 05 | Daily Game Loop — Conversations | `[ ] TODO` |
| 06 | Memory System | `[ ] TODO` |
| 07 | Poltergeist Planning & Sleep/Reset | `[ ] TODO` |
| 08 | Pause Menu & In-Game UI | `[ ] TODO` |
| 09 | End Game Sequence | `[ ] TODO` |

---

## Phase Summaries

### Phase 01 — Project Scaffold
Set up the Vite + Phaser 3 project. After this phase you will be able to open a browser tab and see a Phaser canvas with a placeholder coloured background — proof that the stack works.

**Your actions required:** Install Node.js if not already installed.

---

### Phase 02 — World Layout & Character Movement
Build the 4-room house layout using a tilemap. Place the 3 characters as sprites with directional walking animations. Characters will auto-navigate between rooms using Phaser's pathfinding. Room access rules are enforced (poltergeist blocked from bedroom; husband/wife blocked from mystery room).

**Your actions required:** Generate character sprites and tileset art using Gemini (exact prompts and specs provided in phase file).

---

### Phase 03 — Character Creation Screen
Build the game's opening screen where the player names each character, reads/edits the husband and wife personalities, and views the poltergeist's locked personality. The API config for each character's LLM is loaded from `api-config.json` and displayed on screen.

**Your actions required:** Fill in `config/api-config.json` with your own API keys and model names before testing this phase.

---

### Phase 04 — LLM Integration & Conversation Engine
Wire up the LLM calls per character using the config. Build the conversation turn engine: handles turn limits (20 for husband/wife, 10 for poltergeist), word limits (50 words/turn), turn-limit awareness prompting, and writing conversation logs to file.

**Your actions required:** Ensure your API keys in `api-config.json` are valid and have sufficient quota.

---

### Phase 05 — Daily Game Loop — Conversations
Implement the full daily conversation cycle: random room selection (excluding mystery room and previous day's room), random assignment of who starts the husband/wife conversation, poltergeist's random target selection, character movement to correct rooms, and sequential conversation triggering. Dialogue is displayed on screen as conversations happen.

**Your actions required:** None — this is fully automated. You play the role of observer.

---

### Phase 06 — Memory System
After each day's conversations, characters reflect and write to their memory files. Husband/wife pick 5 items to remember (max 20 total; discard 5 if at capacity). Poltergeist picks 2 (max 10 total; discard 2 if at capacity). The reflection process is displayed on screen character by character. Memory is injected into each character's system prompt for the next day.

**Your actions required:** None. Memory files are created automatically in `data/memories/`.

---

### Phase 07 — Poltergeist Planning & Sleep/Reset
The poltergeist retreats to the mystery room and delivers a short diabolical monologue (visible to the player) based on the day's events. All characters then sleep. The day counter increments and a new day begins. The daily random selections reset.

**Your actions required:** None.

---

### Phase 08 — Pause Menu & In-Game UI
The player can pause the game at any time and view: current day (Day X of 10), each character's memory, and each character's personality. The pause menu is layered over the game world without disrupting state.

**Your actions required:** Optionally generate UI art (pause screen background, panel frames) — specs provided in phase file.

---

### Phase 09 — End Game Sequence
On day 11, all characters meet in the living room. The husband expresses his feelings about the wife; the wife expresses her feelings about the husband. The poltergeist delivers a verdict on whether their plan succeeded. All dialogue is logged to `data/logs/end-of-game-conversations/`. The player can then return to the start screen.

**Your actions required:** None.

---

## Divergences from Original Spec

_None yet. All divergences will be logged here with date and reason._
