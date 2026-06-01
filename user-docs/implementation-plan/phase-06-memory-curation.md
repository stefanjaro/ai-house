# Phase 06: Memory Curation

Status: NOT STARTED

## Purpose

Turn memory candidates into a player-controlled system by letting the player choose what survives in each character's journal.

## Scope

- Let the player select which generated entries are applied to each character's journal.
- Make journals viewable at any time during the active game without undermining the current staged conversation experience.
- Apply `UPDATE` operations safely so prior entries are replaced intentionally and visibly.
- Keep journal state local and internally consistent through a single active day.

## Out Of Scope

- Feeding journals into future prompts.
- Daily progression constraints.
- Forgetting history display.

## Acceptance Criteria

- The player can choose journal outcomes after each conversation.
- Each character's current journal is viewable at any time in the browser through a UI surface that fits the scene-based product direction.
- Journal updates preserve the intended replacement behavior for `UPDATE` entries.

## Implementation Tasks

- [ ] Define the journal state contract and update semantics.
- [ ] Add regression tests for applying `NEW` and `UPDATE` entries and preventing contradictory journal state.
- [ ] Implement the curation scene and a journal viewer that coexists cleanly with setup, review, and conversation screens.
- [ ] Browser-verify selecting memories, inspecting journals, and replaying the flow without losing current state.

## Builder Inputs Needed

- None.

## Tests And Checks

- `vitest` tests for journal application logic and state consistency.
- Browser verification of curation and journal viewing flows.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- 2026-06-01: Phase 06 should be designed around dedicated scenes or overlays, not around a generic utility sidebar. Phase 02 established a staged full-screen flow, so journal access now needs to preserve that structure.
