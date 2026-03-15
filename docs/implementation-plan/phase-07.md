# Phase 07 — UI Shell & Medieval Styling

**Status:** DONE — 2026-03-15
**Depends on:** Phase 01 (project setup), Phase 00 (assets should be available)

## Goal
Build the four-panel game layout and apply medieval visual styling. By the end of this phase the layout looks like the game (correct proportions, correct regions, medieval aesthetic) even if all content is placeholder text and static images.

## What Gets Built

### Layout (HTML + CSS)
Four regions, always visible during gameplay (see `docs/idea/main-game-screen-layout.png` for wireframe reference):

| Region | Description |
|--------|-------------|
| **Top bar** | Thinnest bar. Displays "Day X of 10". Centered. |
| **Center screen** | Largest region. Displays the room background, character sprites, and conversation overlays. |
| **Right panel** | Sidebar. Will contain the history accordion (built in Phase 10). Placeholder "History" heading for now. |
| **Bottom bar** | Displays character cards (avatar + name). Clicking a card opens a modal. |

### CSS / Visual Design
- Medieval color palette: deep burgundy, aged gold, dark green, near-black, parchment cream
- Body background: very dark, like aged wood or stone
- Top bar and bottom bar: parchment-textured or deep-colored with gold border accents
- Fonts: Use a free Google Font with a medieval/serif feel (e.g., `EB Garamond` or `MedievalSharp`)
- Right panel: slightly lighter dark background, subtle border

### Bottom bar — character cards
Three cards side by side (husband, wife, poltergeist). Each shows:
- Character sprite (from `public/assets/sprites/`)
- Character name (placeholder until config loads)
- Two buttons: "Personality" and "Memory"

### Modals (scroll pop-ups)
When a bottom bar button is clicked:
- A modal appears with the parchment texture (`public/assets/ui/parchment.png`) as background
- The modal has a scrollable content area
- The modal has a close button (styled as a wax seal or `×`)
- Content is placeholder text for now (real content wired in Phase 09)

### Screen routing
A simple screen router in `src/main.js`:
- Start screen (Phase 08 will build it properly — placeholder "Start Game" button for now)
- Game screen (the four-panel layout built in this phase)
- End screen (placeholder)

Clicking "Start Game" switches to the game screen. This does not need to be wired to real game logic yet.

### No tests needed for this phase
UI layout and styling is verified by visual inspection, not automated tests. However:
- Ensure no JavaScript errors appear in the browser console
- Ensure layout renders correctly at 1280×720 and at typical laptop screen sizes (1440×900)

## User Testing Instructions
After this phase:
1. `npm run dev` + `npm run server`
2. Open the browser
3. Click "Start Game" — the four-panel layout appears
4. Verify:
   - Top bar shows placeholder day text
   - Right panel has a "History" placeholder
   - Bottom bar shows three character cards with sprites
   - Clicking "Personality" or "Memory" opens a scrollable parchment modal
   - Clicking close dismisses the modal
5. Resize the browser window — layout should remain usable (no overlap or breakage)

## Acceptance Criteria
- [ ] Four-panel layout renders correctly
- [ ] Medieval styling is applied (colors, fonts, textures)
- [ ] Character sprites display in the bottom bar
- [ ] Modals open and close correctly
- [ ] No console errors
- [ ] Screen routing works (start → game)

## Divergences
_None yet._
