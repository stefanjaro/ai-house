# Phase 09 — Center Screen: Day Activities

**Status:** DONE (2026-03-28)
**Depends on:** Phase 05 (LLM/conversations), Phase 06 (memory), Phase 07 (UI shell), Phase 08 (character creation)

## Goal
Build the core gameplay experience in the center screen. This phase connects all the game logic, LLM services, and memory systems to the visual layer. By the end of this phase the full 10-day game loop runs visually in the browser.

## What Gets Built

### Center screen component (`src/ui/components/centerScreen.js`)
Manages what's displayed in the center screen region depending on the current activity.

**States the center screen can be in:**
1. **Random selection display** — shows which rooms and which characters were selected for the day
2. **Room view** — fades in a room background, then fades in the relevant character sprites
3. **Conversation view** — overlaid speech bubbles over the room, streaming text, scrollable history of prior turns
4. **Memory reflection view** — room stays, streamed "thought" text appears as speech bubbles
5. **Day transition** — "Day X begins" overlay fades in/out
6. **Sleep** — dim the screen, show a brief sleep animation or text ("The house falls quiet...")

### Room and character rendering
- Room backgrounds: full-bleed image in the center screen, with a `fade-in` CSS animation on load
- Character sprites: positioned at the bottom of the center screen, also fade in after the room
  - Couple conversation: both husband and wife sprites visible
  - Poltergeist conversation: poltergeist + the selected character
  - Memory writing: single character visible (wife first, then husband; poltergeist alone in mystery room)

### Speech bubble component (`src/ui/components/speechBubble.js`)
- Appears as a slightly transparent overlay over the room
- Shows the speaker's avatar (small, circular) and name at the bottom left
- Text streams in character by character (using the `onChunk` callback from the LLM service)
- Previous turns scroll upward as new turns are added; latest is always at the bottom
- Player can scroll up to read earlier turns

### Click-to-proceed mechanic
- After each activity (random selection display, conversation, memory writing, sleep), a subtle prompt appears: "Click anywhere to continue"
- Clicking the center screen anywhere advances to the next activity
- The click should NOT be active mid-stream (while text is still being generated)

### Day flow wiring
Wire the full daily activity sequence:
1. Show random selections
2. → click → Room fade-in for couple, conversation streams
3. → click → Room fade-in for poltergeist conversation, streams
4. → click → Bedroom for memory writing (wife reflects, then husband)
5. → click → Mystery room for poltergeist memory + diabolical planning
6. → click → Sleep transition
7. → click → New day begins (back to step 1, or end game if day > 10)

### Bottom bar: wire personality and memory modals
- Load actual personality content into personality modals from `fileService`
- Load actual memory content into memory modals from `fileService`

### Tests
UI animation and streaming behavior is hard to unit test. Focus tests on:

`tests/ui/centerScreen.test.js`:
- Correct activity sequence is followed (use mocked service calls)
- Click-to-proceed does not fire during active streaming
- Room transitions happen in correct order
- Day manager state advances correctly after each activity

> **TDD order:** Write tests for the activity sequence and click behavior first. Run — fail. Implement. Run — pass.

## User Testing Instructions
After this phase:
1. `npm run dev` + `npm run server`
2. Ensure `config.json` has valid API credentials
3. Start a new game, complete character creation
4. Watch the first day unfold:
   - Random selections appear in the center screen
   - Click — room fades in with characters
   - Conversation text streams in, turn by turn
   - You can scroll up to read earlier turns
   - Click when conversation ends — new room fades in for poltergeist conversation
   - Memory reflections stream in the bedroom and mystery room
   - Sleep transition
   - Day 2 begins automatically
5. Let it run for 2–3 days to confirm the loop is stable
6. Bottom bar modals show correct memory and personality content

## Acceptance Criteria
- [ ] Full daily activity sequence runs without errors
- [ ] Text streams in (not all at once)
- [ ] Fade-in effects on rooms and characters work
- [ ] Speech bubbles scroll correctly
- [ ] Click-to-proceed works at the right moments
- [ ] Memory and personality modals show correct content
- [ ] `npm test` passes

## Divergences

> **DIVERGENCE:** LLM calls now go through an Express proxy endpoint (`POST /api/llm/stream`) instead of directly from the browser. The original spec said "direct streaming calls from the frontend" but the OpenCode Zen endpoint (and other providers) block cross-origin requests from `localhost:5173`. The proxy forwards `{ endpoint, apiKey, model, messages }` from the client and streams the SSE response back. API keys are still visible to the browser via `config.json`, but the HTTP calls now originate server-side.

> **DIVERGENCE:** `gameOrchestrator.js` was extracted as a new service (`src/services/gameOrchestrator.js`) to keep the day-loop logic pure and testable. `gameScreen.js` now returns `{ el, init }` instead of a plain DOM element, and `init(config, names, onGameOver)` starts the game loop. `main.js` was updated accordingly.

> **DIVERGENCE:** `createCenterScreen()` now returns `{ el, controller }` instead of a plain DOM element. `gameScreen.js` uses the controller to drive all visual updates (room transitions, speech bubbles, overlays) in response to game loop callbacks.

> **DIVERGENCE:** `bottomBar.js` now loads personality and memory content live from the server via `fileService` when the modal buttons are clicked, rather than using placeholder text. It also exports `updateCardName()` so `main.js` can update card labels after character creation.
