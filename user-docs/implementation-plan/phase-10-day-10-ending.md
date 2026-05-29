# Phase 10: Day 10 Ending

Status: NOT STARTED

## Purpose

Complete the intended game loop by ending play after Day 10 and summarizing the simulation's narrative outcome.

## Scope

- Stop progression after Day 10.
- Present final journals and forgotten-memory history for all characters.
- Summarize relationship evolution and notable character shifts using the tracked game state.
- Ensure the ending flow is understandable without exposing hidden implementation details.

## Out Of Scope

- Major visual redesign beyond what the ending screen requires.
- Production deployment hardening.
- Sound implementation.

## Acceptance Criteria

- The player can complete ten days and reach a clear ending state.
- The ending shows final journals, forgotten memories, and a readable summary of how relationships changed.
- The game does not continue into Day 11.

## Implementation Tasks

- [ ] Define the Day 10 completion contract and ending summary data needs.
- [ ] Add tests for end-of-game progression, final-state assembly, and prevention of further play.
- [ ] Implement the ending sequence and final review screens.
- [ ] Browser-verify a complete run or a seeded shortcut to the ending flow.

## Builder Inputs Needed

- Choose deployment target and runtime approach before any release-hardening work begins after this phase.

## Tests And Checks

- `vitest` tests for end-of-game state transitions and ending summary assembly.
- Browser verification of the final Day 10 ending flow.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- None.
