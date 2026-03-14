# Phase 03 — Character Creation Screen

**Status:** `[ ] TODO`
**Depends on:** Phase 02 complete and tested
**Goal:** The game opens on a character creation screen where the player names each character, edits personalities, and reviews which model powers each character.

---

## What You'll Be Able to Test

After this phase you will see:
- A character creation screen shown before the game world loads
- Three character panels (husband, wife, poltergeist), each showing:
  - The character's sprite (unanimated, facing forward)
  - A text input field to set their name (with placeholder default names)
  - A text area to edit the personality (husband and wife only — editable)
  - A read-only personality display for the poltergeist
  - The model name loaded from `config/api-config.json` displayed below each character
- A "Start Game" button that saves the names and personalities and transitions to the game world
- If `api-config.json` is missing or malformed, an error message tells the player exactly what to fix

---

## What Gets Built

### 1. CharacterCreationScene

A dedicated Phaser scene (`src/scenes/CharacterCreationScene.js`) that overlays an HTML-based UI on top of the Phaser canvas.

> **Note:** Phaser's built-in text input is limited. Character creation uses standard HTML form elements (inputs, textareas) positioned over the canvas using CSS. Phaser manages the canvas; plain HTML handles the form. This is the standard approach for complex text input in Phaser games.

### 2. Character Panels

Three side-by-side panels. Each panel contains:
- Character sprite image (static, forward-facing frame from the sprite sheet)
- Name input field (max 20 characters)
- Personality textarea:
  - Husband and wife: editable, pre-populated with content from `data/personalities/husband-personality.md` and `data/personalities/wife-personality.md`
  - Poltergeist: read-only, loaded from `data/personalities/poltergeist-personality.md`
- Model label: reads `model` field from `config/api-config.json` for this character

### 3. Default Personalities

Three starting personality files are created at project setup:

**`data/personalities/husband-personality.md`** (editable default):
```
You are a warm and curious person who loves asking questions and learning about others.
You value honesty and directness but always speak with kindness.
You tend to be nostalgic and enjoy reminiscing about good times.
You find conflict uncomfortable and prefer to talk through disagreements calmly.
```

**`data/personalities/wife-personality.md`** (editable default):
```
You are thoughtful and ambitious, always planning for what comes next.
You express yourself clearly and confidently, and you're not afraid to disagree.
You have a dry sense of humour that surfaces when you're relaxed.
You care deeply about the people you love and show it through acts of support.
```

**`data/personalities/poltergeist-personality.md`** (read-only):
```
You are a mischievous little devil whose sole purpose is to sow seeds of doubt and discord.
You are charming and deceptively friendly on the surface.
You never attack directly — instead, you plant subtle suggestions, misrepresent what others have said, and twist innocent remarks into something sinister.
You delight in watching relationships fray. You are patient and strategic.
```

### 4. Room Influence Files

These are created at project setup and are never editable in-game:

**`data/room-influences/bedroom-influence.md`**
```
This is a space for reflection and intimacy. Conversations here lean toward the past —
shared memories, old stories, things that shaped who you are. The mood is quiet and warm.
```

**`data/room-influences/kitchen-influence.md`**
```
This is a space for planning and ambition. Conversations here lean toward the future —
goals, dreams, practical plans, and what comes next. The mood is energised and purposeful.
```

**`data/room-influences/livingroom-influence.md`**
```
This is a space for relaxation and enjoyment. Conversations here can go anywhere —
current interests, opinions, jokes, observations about life. The mood is easy and open.
```

**`data/room-influences/mystery-influence.md`** (poltergeist only):
```
This is your domain. You are alone here. This is where you scheme, reflect on your
progress, and prepare your next move. Speak freely — no one is listening but yourself.
```

### 5. API Config Loading

At scene load, `config/api-config.json` is fetched. If the file:
- **Exists and is valid:** model names are displayed in each character panel
- **Is missing:** a red banner reads "api-config.json not found. Copy config/api-config.template.json to config/api-config.json and fill in your details."
- **Has missing fields:** specific missing fields are listed

### 6. Save & Transition

When "Start Game" is clicked:
1. Personality files are updated with the textarea content (written to `data/personalities/`)
2. Character names are saved to a runtime game state object
3. The scene transitions to the game world (Phase 02's world scene)

> Note: file writing to `data/personalities/` works via the Vite dev server during development. A note in `setup.md` will explain this.

---

## Your Actions Required

1. Before testing this phase, create `config/api-config.json` from the template:
   ```bash
   cp config/api-config.template.json config/api-config.json
   ```
2. Open `config/api-config.json` and fill in your API keys, endpoints, and model names for each character.
3. Run the game and verify all three model names appear in the character panels.

---

## Divergences from Original Spec

_None._
