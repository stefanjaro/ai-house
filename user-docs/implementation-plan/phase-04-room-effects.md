# Phase 04: Room Effects

Status: NOT STARTED

## Purpose

Make room choice strategically meaningful by having room context shape conversation behavior, starting with the sacrificial altar inversion rule.

## Scope

- Inject selected room context into conversation prompts in a stable, testable way.
- Implement the sacrificial altar room so characters act as the opposite of their established personalities.
- Add distinct but lighter room framing for the bedroom, guest bedroom, and living room.
- Surface the active room effect clearly in the UI before generation, during conversation, and in any related loading or review states.

## Out Of Scope

- Journal generation.
- Daily restrictions.
- Sleep-cycle forgetting.

## Acceptance Criteria

- Every conversation is aware of the chosen room.
- The sacrificial altar room creates an obvious inversion in dialogue style and decision-making.
- The active room effect is visible to the player before and during the conversation without relying only on decorative art differences.

## Implementation Tasks

- [ ] Specify room effect rules and update stack or architecture notes if a separate prompt service layer is introduced.
- [ ] Add tests for room-specific prompt assembly and altar inversion behavior.
- [ ] Implement room effect messaging in both prompt logic and the existing scene-based review/conversation UI.
- [ ] Browser-verify at least one comparison between a normal room and the altar room.

## Builder Inputs Needed

- None.

## Tests And Checks

- `vitest` tests for room-effect prompt construction.
- Browser verification of room selection clarity and altar behavior.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- 2026-06-01: Phase 04 should now focus primarily on behavioral differences and player-facing explanation. Phase 02 already introduced strong room-specific art and framing, so the remaining work is to make room choice mechanically legible rather than merely more decorative.
