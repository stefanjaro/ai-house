# Phase 09: Forgetting

Status: NOT STARTED

## Purpose

Introduce memory loss during sleep so journals drift over time and the simulation stops feeling fully deterministic.

## Scope

- Implement the end-of-day forgetting probabilities and single-outcome rule.
- Remove forgotten entries from active journals safely.
- Record forgotten entries so the player can review memory loss later.
- Present the sleep-cycle result clearly at day end.

## Out Of Scope

- Day 10 finale.
- Visual polish beyond what is needed to explain forgetting.
- Audio.

## Acceptance Criteria

- At day end, each character may forget entries according to the defined rules.
- Active journals reflect the updated memory state after forgetting.
- The game keeps a visible record of what was forgotten and when.

## Implementation Tasks

- [ ] Define the forgetting algorithm and history-tracking structure.
- [ ] Add tests for probability bucket selection, entry removal, and forgotten-history recording.
- [ ] Implement the end-of-day forgetting UI and state mutation flow.
- [ ] Browser-verify that forgetting results are understandable and do not corrupt journal state.

## Builder Inputs Needed

- None.

## Tests And Checks

- `vitest` tests for forgetting logic and history tracking.
- Browser verification of sleep-cycle outcomes.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- None.
