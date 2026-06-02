# Phase 11: Visual Polish

Status: NOT STARTED

## Purpose

Refine the shipped visual direction after the remaining mechanics are proven, focusing on consistency, readability, motion quality, and runtime efficiency rather than inventing a brand-new look.

## Scope

- Refine card layouts, typography, color systems, and art usage across setup, review, conversation, journals, and day-flow scenes.
- Improve consistency between bitmap room/portrait art and lighter-weight UI-native visuals.
- Tune animation, transition timing, and selection states so motion feels deliberate without slowing play.
- Improve readability for longer conversations, memory screens, and end-of-day review states.
- Reduce visual-performance waste by tightening asset sizing, responsive behavior, and layout stability where needed.

## Out Of Scope

- New core mechanics.
- Audio implementation.
- Broad architecture rewrites unrelated to presentation.

## Acceptance Criteria

- The game feels visually intentional, scene-based, and cohesive across all major flows.
- Updated visuals do not reduce usability on desktop or mobile.
- The polished presentation is browser-verified against the existing gameplay loop.

## Implementation Tasks

- [ ] Audit which visual weaknesses remain after gameplay phases are complete.
- [ ] Add or update tests where UI state handling changed materially.
- [ ] Refresh the visual system using the already-established art direction, replacing or adding assets only where clear gaps remain.
- [ ] Browser-verify the game on representative desktop and mobile sizes.

## Builder Inputs Needed

- None, unless the user wants to provide specific visual references before polish begins.

## Tests And Checks

- Targeted `vitest` UI regression coverage where interactions changed.
- Browser verification of representative polished flows on desktop and mobile.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.
- 2026-06-02: A major tone and art-direction reset was pulled forward before Phase 11 formally started. The shipped UI now uses a bright comic-book palette, cartoony portrait and room art, and louder playful copy rather than the previous forest-cabin mood.

## Divergences

- 2026-06-01: Much of the originally implied Phase 11 work was pulled forward into Phase 02, including the core art direction, room illustration, portrait framing, motion direction, and the shift away from a dashboard-like shell. Phase 11 is now a residual polish and consistency pass, not a first major visual redesign.
- 2026-06-02: The approved cabin direction was itself replaced by a comic-book apartment direction before Phase 11 began in earnest. Later polish work should treat the new goofy art and tone as canonical rather than trying to reconcile against the earlier moody presentation.
