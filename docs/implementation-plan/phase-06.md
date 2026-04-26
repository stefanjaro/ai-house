# Phase 06 - Day Planning Flow

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Implement the player-controlled daily rhythm: choose a pair, choose a room, watch travel, then repeat with restrictions for the middle of the day.

## Scope

- Add Day 1 through Day 10 state.
- Add start-of-day selection for two characters and one room.
- Add middle-of-day selection after the first conversation completes.
- Enforce that the middle pair cannot be the same pair as the start-of-day pair.
- Enforce that the middle room cannot be the same room as the start-of-day room.
- Trigger character travel to the selected room before conversation setup.

## Tests First

Write tests before implementation for:

- Day state initialization.
- Valid and invalid character pair selection.
- Valid and invalid room selection.
- Middle-of-day restriction enforcement.
- Day phase transitions around pending travel and conversation readiness.

## Implementation Notes

- Keep day rules pure in `src/engine/`.
- UI should prevent invalid choices and engine should reject them.
- Do not call LLMs yet; this phase can still use mock conversation completion.

## Browser Verification

- In the running app, select valid and invalid pairs/rooms for both day phases.
- Confirm characters visibly walk to the selected room.
- Confirm the second selection excludes or rejects the first pair and room.

## Acceptance Criteria

- A player can complete the planning parts of a day without LLM integration.
- Rule violations are impossible or clearly handled.
- Day state is ready for conversation presentation.

## Divergence Log

No divergences yet.

