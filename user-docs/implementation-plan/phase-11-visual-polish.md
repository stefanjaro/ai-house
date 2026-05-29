# Phase 11: Visual Polish

Status: NOT STARTED

## Purpose

Improve the game's visual identity after the mechanics are proven fun enough to deserve polish.

## Scope

- Refine card layouts, typography, color systems, and SVG artwork.
- Add room-specific art treatment, character framing, and stronger visual hierarchy.
- Introduce tasteful animation or transition work that improves feel without slowing play.
- Improve readability for longer conversations and journal review screens.

## Out Of Scope

- New core mechanics.
- Audio implementation.
- Broad architecture rewrites unrelated to presentation.

## Acceptance Criteria

- The game feels visually intentional and recognizably card-game inspired.
- Updated visuals do not reduce usability on desktop or mobile.
- The polished presentation is browser-verified against the existing gameplay loop.

## Implementation Tasks

- [ ] Audit which visual weaknesses remain after gameplay phases are complete.
- [ ] Add or update tests where UI state handling changed materially.
- [ ] Create required SVG assets and integrate the refreshed presentation.
- [ ] Browser-verify the game on representative desktop and mobile sizes.

## Builder Inputs Needed

- None, unless the user wants to provide specific visual references before polish begins.

## Tests And Checks

- Targeted `vitest` UI regression coverage where interactions changed.
- Browser verification of representative polished flows on desktop and mobile.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- None.
