# Phase 08: Day Structure

Status: NOT STARTED

## Purpose

Wrap the core interaction in the intended two-conversation daily loop so choices have short-term consequences and constraints.

## Scope

- Add day tracking from Day 1 onward.
- Support exactly two conversations per day.
- Prevent reusing the same pair and the same room within the same day.
- Show end-of-day state transitions into bedroom scenes or summaries before the next day begins.
- Fit day progress, restrictions, and between-conversation transitions into the current scene-based structure rather than assuming a persistent dashboard HUD.

## Out Of Scope

- Forgetting probabilities.
- Day 10 ending.
- Sound design.

## Acceptance Criteria

- A day begins, allows two valid conversations, and then transitions to day end.
- The game enforces the pair and room reuse restrictions within the same day.
- The player can clearly see day state and what remains to be done before ending the day without adding a heavy always-on control bar that fights the current composition.

## Implementation Tasks

- [ ] Define the day-state model and constraints for pair and room reuse.
- [ ] Add tests for day progression, conversation counting, and restriction enforcement.
- [ ] Implement day progress framing, second-conversation flow, and day-end transition in a way that matches the established staged scenes.
- [ ] Browser-verify a full day from start through both conversations.

## Builder Inputs Needed

- None.

## Tests And Checks

- `vitest` tests for day-state transitions and restriction logic.
- Browser verification of the full two-conversation daily loop.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- 2026-06-01: The original Phase 08 wording implied a persistent day HUD layered over the app. The shipped Phase 02 product is now scene-based, so day structure should be introduced through transitions, compact progress framing, and scene-to-scene state rather than a dashboard shell.
