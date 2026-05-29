# Phase 02: Trading Card Presentation

Status: NOT STARTED

## Purpose

Convert the functional prototype into a presentation that feels like a turn-based card duel without expanding the gameplay loop yet.

## Scope

- Replace plain selection controls with card-based character, room, and starting-speaker choices.
- Restyle the conversation screen so the exchange feels like a duel between two character cards.
- Introduce SVG-based custom visual assets needed for cards or room motifs.
- Improve pacing and readability of transcript reveal and turn transitions.

## Out Of Scope

- Editable personalities.
- Journal mechanics.
- Additional game rules beyond the existing duel flow.

## Acceptance Criteria

- All major player decisions in the current loop are made through card-like UI components.
- The conversation screen clearly presents both active characters and the selected room.
- The user can play the same Phase 01 flow in the browser with the new presentation.

## Implementation Tasks

- [ ] Define the card system, layout primitives, and SVG asset needs.
- [ ] Add tests for selection-state behavior and room/character card interactions.
- [ ] Implement card-based setup screens and duel presentation.
- [ ] Verify that the UI remains usable on desktop and mobile browser sizes.
- [ ] Browser-test the updated loop and record what feels stronger or weaker than Phase 01.

## Builder Inputs Needed

- None.

## Tests And Checks

- `vitest` component or DOM-focused tests for card selection behavior.
- Browser verification of setup flow, responsive layout, and duel readability.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- None.
