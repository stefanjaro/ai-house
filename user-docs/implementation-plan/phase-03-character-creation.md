# Phase 03: Character Creation

Status: NOT STARTED

## Purpose

Let the player shape the cast by editing names and personalities, while keeping personalities inspectable during later play.

## Scope

- Add a character creation or pre-game editing flow for all three characters.
- Enforce the 250-word maximum on stored default or edited personalities.
- Provide a way to inspect each character's current personality during gameplay.
- Ensure edited personalities feed directly into conversation prompt construction.

## Out Of Scope

- Journal mechanics.
- Room inversion logic beyond passing the selected room into prompts.
- End-of-day progression.

## Acceptance Criteria

- The player can rename each character and edit each personality before starting play.
- The game enforces the personality length limit.
- The player can inspect current personalities at any time during the active game flow.
- Edited personalities change the tone or behavior of generated conversations in a visible way.

## Implementation Tasks

- [ ] Define the local state contract for character setup and in-game reference views.
- [ ] Add validation tests for personality limits and character-edit persistence across the active session.
- [ ] Build the editing flow and in-game personality inspection UI.
- [ ] Confirm updated personalities are used in prompt assembly and regression-test the payload shape.
- [ ] Browser-verify both editing and inspection flows.

## Builder Inputs Needed

- None.

## Tests And Checks

- `vitest` tests for personality validation and session-state updates.
- Browser verification of create, edit, inspect, and play flows.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- None.
