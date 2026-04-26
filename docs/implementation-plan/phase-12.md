# Phase 12 - Playtest Polish and Packaging

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Tune the game after the full loop exists so it feels coherent, stable, and approachable for local play.

## Scope

- Perform a full visual and interaction pass across desktop and mobile-sized viewports.
- Review prompt behavior and journal quality after real playtests.
- Improve loading, error, empty, and disabled states.
- Add local run instructions for the user.
- Remove temporary debug UI from production paths or hide it behind an explicit dev flag.
- Confirm gitignored files and templates are correct.

## Tests First

Write tests before implementation for:

- Any regressions found during playtest.
- Any new edge cases in setup, day flow, LLM parsing, or journals.
- Production/dev flag behavior for debug overlays.

## Implementation Notes

- Keep polish changes grounded in actual playtest friction.
- When feel-based changes diverge from v5, record them in the relevant phase file, not only here.
- Do not add deployment complexity.

## Browser Verification

- Complete a full local playthrough or accelerated equivalent in Chrome DevTools MCP.
- Check console and network panels for avoidable errors.
- Verify layout at representative desktop and mobile viewport sizes.

## Acceptance Criteria

- The game is ready for the user to run locally.
- Known limitations are documented.
- All phase files accurately reflect status, completion dates, and divergences.

## Divergence Log

No divergences yet.

