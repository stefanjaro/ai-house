# Phase 03: Character Creation

Status: NOT STARTED

## Purpose

Let the player shape the cast by editing names and personalities, while keeping personalities inspectable during later play.

## Scope

- Extend the existing staged setup flow so the player can rename and tune all three characters without breaking the current one-step-at-a-time scene structure.
- Enforce the 250-word maximum on stored default or edited personalities.
- Provide a way to inspect each character's current personality during setup review and later during gameplay.
- Decide how character portraits interact with edited names and personalities so the visual identity still feels coherent after customization.
- Ensure edited personalities feed directly into conversation prompt construction.

## Out Of Scope

- Journal mechanics.
- Room inversion logic beyond passing the selected room into prompts.
- End-of-day progression.

## Acceptance Criteria

- The player can rename each character and edit each personality within the current staged setup flow.
- The game enforces the personality length limit.
- The player can inspect current personalities at any time during the active game flow without collapsing the conversation UI into a utility panel.
- Edited personalities change the tone or behavior of generated conversations in a visible way.

## Implementation Tasks

- [ ] Define the local state contract for character setup, confirmation review, and in-game reference views.
- [ ] Add validation tests for personality limits and character-edit persistence across the active session.
- [ ] Build the editing flow as an extension of the current step-based setup scenes and add a lightweight in-game inspection surface.
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

- 2026-06-01: Phase 03 is now expected to build on the shipped scene-based setup flow rather than introducing a separate generic pre-game editor, because Phase 02 replaced the old dashboard-style shell with sequential setup scenes and a dedicated confirmation step.
