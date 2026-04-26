# Phase 10 - Full Day Loop and Endgame

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Connect all gameplay systems into the complete Day 1 through Day 10 local simulation.

## Scope

- Run exactly two conversations per day.
- Move characters to respective bedrooms at end of day.
- Apply sleep-cycle forgetting after the second conversation.
- Advance to the next day until Day 10 completes.
- Show final journals and forgotten entries at the end of Day 10.
- Ensure there are no saves, points, or win/loss states.

## Tests First

Write tests before implementation for:

- Full day state machine.
- Day increment and Day 10 termination.
- End-of-day bedroom movement targets.
- Final recap data shape.
- No additional conversation can start after the end state.

## Implementation Notes

- Keep the no-save assumption simple: one active local run in memory plus generated logs if enabled.
- The husband's friend should sleep in the guest bedroom; the couple should return to the master bedroom unless later design changes specify otherwise.
- Preserve player-driven simulation framing instead of adding scoring.

## Browser Verification

- Run through a shortened test mode or controlled fast-forward to verify Day 10 ending.
- Confirm normal flow still supports two conversations per day.
- Confirm final recap shows active and forgotten journal entries for all three characters.

## Acceptance Criteria

- The game can be played from setup to ending.
- Day and phase transitions are clear to the player.
- Endgame reflects the accumulated journal history.

## Divergence Log

No divergences yet.

