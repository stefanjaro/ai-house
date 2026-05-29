# Phase 01: Character Duel Prototype

Status: COMPLETED

## Purpose

Prove the smallest playable version of the core loop: choose two characters, choose a room, choose a starting speaker, enter a short topic, and watch a short AI-driven conversation.

## Scope

- Establish the initial app scaffold and testing setup if missing.
- Define default names and default personalities for all three characters.
- Build the first playable browser flow for character pair selection, room selection, starting speaker selection, and topic entry.
- Implement a minimal server-side integration boundary for OpenCode Zen so secrets stay out of the client.
- Render a short turn-based conversation transcript in a simple but readable way.

## Out Of Scope

- Card-heavy visual polish.
- Editable character creation.
- Journal generation and persistence.
- Daily loop, forgetting, ending sequence, and sound.

## Acceptance Criteria

- The player can start a conversation by choosing two characters, one room, one starting speaker, and a topic of 25 words or fewer.
- The game produces a short multi-turn conversation between the selected characters using their default personalities.
- The conversation flow is manually playable in the browser on a local machine.
- Secrets remain outside committed client-side code.

## Implementation Tasks

- [x] Confirm the app runtime split and document any newly locked stack choices in `agent-reference/stack-decisions.md`.
- [x] Add minimal project scaffolding and Vitest coverage for conversation request shaping and topic validation.
- [x] Create default character and room seed data with room-aware prompt inputs.
- [x] Add the minimal browser flow for setup and transcript playback.
- [x] Wire a server-side OpenCode Zen request path with safe error handling.
- [x] Verify the phase in the browser and record results in Progress Notes.

## Builder Inputs Needed

- Local OpenCode Zen credentials before live API integration is completed.

## Tests And Checks

- `vitest` unit tests for topic-length validation and conversation payload shaping.
- Browser verification of the end-to-end duel flow.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.
- 2026-05-30: Rebuilt the repo from the reset state with a fresh Vite + vanilla JS client, local Express API boundary, and Vitest coverage for topic validation and OpenCode Zen payload shaping.
- 2026-05-30: Added default cast and room seed data, a browser flow for pair/room/starter/topic selection, and animated transcript playback for a six-turn duel.
- 2026-05-30: Verified `npm test`, `npm run build`, a direct live `POST /api/conversations` request against OpenCode Zen, and a browser-played duel on `http://127.0.0.1:5173`.
- 2026-05-30: Re-opened the phase for a focused refinement pass covering replay support, transcript pacing, turn numbering, and UI polish after initial hands-on testing.
- 2026-05-30: Upgraded the duel presentation with a stronger arena-style layout, fixed topic-input focus loss, expanded transcripts to ten turns, added one-click replay, and inserted one-second in-between loading beats so turn order is easier to follow.
- 2026-05-30: Re-verified `npm test`, `npm run build`, a live ten-turn `POST /api/conversations` request, and browser playback including focus retention, numbered turns, loader pacing, and replay.

## Divergences

> **DIVERGENCE:** Phase 1 is temporarily expanding from a merely readable transcript to a more testable and legible duel presentation. The conversation slice is still the same scope, but replay support, clearer turn order, and deliberate pacing are being pulled forward because they materially affect whether the loop is fun to evaluate.
