# Phase 08 — Pause Menu & In-Game UI

**Status:** `[ ] TODO`
**Depends on:** Phase 07 complete and tested
**Goal:** The player can pause the game at any time and inspect the current day, all characters' memories, and all characters' personalities.

---

## What You'll Be Able to Test

After this phase you will see:
- Pressing `Escape` (or `P`) at any time pauses the game and opens the pause menu
- The pause menu shows three tabs: **Status**, **Memories**, **Personalities**
- **Status tab:** "Day X of 10" + current activity in progress
- **Memories tab:** A dropdown to select a character; their memory items are listed below
- **Personalities tab:** A dropdown to select a character; their full personality text is displayed (read-only in the pause menu)
- Pressing `Escape` again (or clicking "Resume") resumes the game exactly where it left off
- The game world is visible but frozen behind the pause menu overlay

---

## What Gets Built

### 1. PauseScene (`src/scenes/PauseScene.js`)

A Phaser scene that launches on top of the game world (`scene.launch('PauseScene')`). When launched:
- The game world scene is paused (`scene.pause('GameScene')`)
- A semi-transparent dark overlay covers the canvas
- The pause menu panel appears in the centre

When dismissed:
- The game world scene resumes (`scene.resume('GameScene')`)
- PauseScene shuts down

### 2. Pause Menu Panel

A centred panel (approximately 700×500px) with:

**Header:**
```
[ ⏸ PAUSED ]        [ Resume ]
```

**Tab bar:**
```
[ Status ]  [ Memories ]  [ Personalities ]
```

**Status tab (default):**
```
Day 3 of 10

Current activity: Poltergeist Conversation
```

**Memories tab:**
```
Character: [ Alice ▾ ]          ← dropdown

Alice's Memories (8 of 20):
  • Felt hopeful about the kitchen plans
  • Poltergeist hinted she works too much
  • Bob seemed distracted during dinner talk
  • ...
```

**Personalities tab:**
```
Character: [ Alice ▾ ]          ← dropdown

Alice's Personality:
  You are thoughtful and ambitious, always planning for what comes next.
  You express yourself clearly and confidently...
  [full text, scrollable]
```

### 3. Keyboard Shortcut

`Escape` key toggles the pause menu. Registered as a global key listener that fires regardless of which scene is active.

### 4. UI Implementation

Like Phase 03, the pause menu uses HTML elements overlaid on the canvas for the dropdowns and scrollable text. The panel background is a Phaser graphics object (rounded rectangle with slight transparency).

### 5. Activity Indicator (Refinement)

The sidebar activity indicator from Phase 05 is refined:
- Cleaner styling, consistent with the pause menu aesthetic
- Stays visible throughout the day's activities
- Is hidden during overlays (memory writing, monologue, day banner)

---

## UI Style Guide

Consistent styling across all UI elements:
- **Font:** A pixel-art compatible web font (e.g., "Press Start 2P" from Google Fonts, loaded via Vite)
- **Colours:**
  - Background panel: `#1a1a2e` (dark navy)
  - Panel border: `#e0b048` (gold)
  - Primary text: `#f0e6c8` (warm off-white)
  - Accent/active: `#e0b048` (gold)
  - Poltergeist elements: `#c0392b` (dark red)
- **Text sizes:** Titles at 16px, body at 8px (pixel fonts render crisply at small sizes)

---

## Your Actions Required

1. Play to any point during day 1 or 2.
2. Press `Escape` and verify the pause menu opens.
3. Check all three tabs — Status, Memories (after day 1 memories are written), Personalities.
4. Resume the game and confirm it continues from where it left off without any issues.

---

## Divergences from Original Spec

_None._
