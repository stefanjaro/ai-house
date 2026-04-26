# Phase 04 - App Shell and Screen Flow

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Create the actual playable app structure around the visual prototype: start, setup, game, and ending states.

## Scope

- Implement a lightweight screen router.
- Add start screen with a direct path into setup.
- Add character creation screen placeholder regions.
- Add game screen layout around the apartment view.
- Add end screen placeholder for the Day 10 recap.
- Maintain visual continuity so the app feels like one game, not separate pages.

## Tests First

Write tests before implementation for:

- Router state transitions.
- Start button moves to character creation.
- Character creation can move to game only when required setup state is valid.
- End screen can be reached by explicit state transition in tests.

## Implementation Notes

- Do not implement full character creation here; reserve that for Phase 05.
- Keep the game screen centered on the apartment scene as the primary experience.
- Avoid landing-page language; the player should arrive at a usable game flow.

## Browser Verification

- Navigate through all screens in Chrome DevTools MCP.
- Confirm screen changes have no console errors, layout jumps, or overlapping text.
- Check at least one mobile-sized viewport.

## Acceptance Criteria

- The app has a complete high-level screen flow.
- The apartment remains the visual anchor of the game screen.
- Tests cover navigation behavior.

## Divergence Log

No divergences yet.

