# Phase 08 — Character Creation Screen

**Status:** DONE
**Completed:** 2026-03-15
**Depends on:** Phase 02 (config), Phase 04 (file service), Phase 07 (UI shell)

## Goal
Build the character creation screen that appears when a new game starts. Players name the characters and edit (or view) their personalities. The model powering each character is displayed automatically from `config.json`.

## What Gets Built

### Character creation screen layout
Three character cards displayed side by side. Each card shows:
- The character's sprite
- An editable text field for the character name (pre-filled from `config.json`)
- The model name (read-only, loaded from `config.json`, displayed beneath the name)
- A text area for editing personality (pre-filled from the personality file via `fileService.getPersonality`)
- For the poltergeist: personality is displayed in a read-only scrollable area, not a text area

### "Begin" button
- Only enabled when all three names are non-empty
- On click:
  - Saves personality edits for husband and wife via `fileService.setPersonality`
  - Stores character names in game state (in-memory, not persisted)
  - Transitions to the game screen

### Wiring to screen router
Update `src/main.js` so that:
- The start screen has a "New Game" button
- "New Game" loads the character creation screen
- After the creation screen's "Begin" is clicked, the game screen loads

### Tests

`tests/ui/characterCreationScreen.test.js`:
- "Begin" button is disabled when any name field is empty
- "Begin" button is enabled when all names are filled
- Poltergeist personality field is read-only
- `setPersonality` is called for husband and wife (but not poltergeist) on submit
- Character names are passed to the game state on submit

> **TDD order:** Write tests first (using DOM testing utilities from Vitest + jsdom). Run — fail. Implement. Run — pass.

## User Testing Instructions
After this phase:
1. `npm run dev` + `npm run server`
2. Click "New Game" on the start screen
3. Verify:
   - All three characters' names are pre-filled from `config.json`
   - Model names appear beneath each name field
   - Personality text areas are pre-filled from personality files
   - Poltergeist personality is read-only
   - Clearing a name disables "Begin"
   - Filling all names re-enables "Begin"
   - Clicking "Begin" transitions to the game screen
4. After clicking "Begin", open `data/personalities/husband-personality.md` — should reflect any edits you made

## Acceptance Criteria
- [x] Screen loads with correct pre-filled data
- [x] Poltergeist personality is not editable
- [x] Personality saves work correctly
- [x] Screen routing works end-to-end (start → character creation → game)
- [x] `npm test` passes

## Divergences
_None yet._
