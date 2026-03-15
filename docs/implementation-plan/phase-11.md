# Phase 11 — End Game Sequence

**Status:** TODO
**Depends on:** Phase 09 (game loop), Phase 10 (history panel)

## Goal
Build the Day 11 end-game sequence: all three characters gather in the living room, the husband and wife express their feelings, and the poltergeist delivers a verdict on whether their plan succeeded.

## What Gets Built

### End game trigger
When `isGameOver(gameState)` returns true (after day 10 sleep), instead of starting day 11 normally:
- The center screen displays: "Day 10 has passed. The time has come for a reckoning."
- Click-to-proceed → end game sequence begins

### End game sequence
All takes place in the living room.

1. **All characters enter** — all three sprites fade in together in the living room
2. **Husband speaks** — LLM generates (streaming) the husband expressing his honest feelings about his wife. System prompt uses his full personality + all memories + no turn limit (this is a monologue, ~100 words max). He speaks as if addressing her directly.
3. **Wife speaks** — same, expressing her feelings about her husband.
4. **Poltergeist "listens in"** — poltergeist sprite animates (e.g., shifts or glows). Then the poltergeist delivers a verdict monologue:
   - Reflects on whether they succeeded in sowing discord
   - Is theatrical and dramatic whether they won or lost
5. **Game over screen** — overlay appears: "The story is told." with two buttons:
   - "View History" — scrolls focus to the right-side history panel
   - "Return to Start" — resets game state and returns to the start screen

### Saving the end game log
The combined transcript (husband feelings + wife feelings + poltergeist verdict) is saved to `data/end-of-game-conversations/` via `fileService`.

### Tests

`tests/engine/endGame.test.js`:
- `isGameOver` triggers correctly after day 10
- End-game transcript is correctly structured before saving

`tests/ui/endGameSequence.test.js`:
- All three sprites are shown in the living room
- Sequence follows the correct order (husband → wife → poltergeist)
- "Return to Start" resets game state

> **TDD order:** Engine tests first, then UI sequence tests.

## User Testing Instructions
After this phase:
1. Run a full 10-day game (you can speed-test by temporarily reducing `totalDays` to 2 or 3)
2. After the last day's sleep, the end game sequence triggers
3. Watch husband, wife, poltergeist deliver their final speeches (streamed)
4. Click "Return to Start" — you're back at the start screen with no lingering state
5. Check `data/end-of-game-conversations/` for a saved log file

## Acceptance Criteria
- [ ] End game triggers correctly after day 10
- [ ] All three speeches stream correctly
- [ ] Log is saved to disk
- [ ] "Return to Start" resets everything cleanly
- [ ] History panel updates to include the end-game entries
- [ ] `npm test` passes

## Divergences
_None yet._
