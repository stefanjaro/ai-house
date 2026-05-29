# Phase 01: Character Duel Prototype

Status: NOT STARTED

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

- [ ] Confirm the app runtime split and document any newly locked stack choices in `agent-reference/stack-decisions.md`.
- [ ] Add minimal project scaffolding and Vitest coverage for conversation request shaping and topic validation.
- [ ] Create default character and room seed data with room-aware prompt inputs.
- [ ] Add the minimal browser flow for setup and transcript playback.
- [ ] Wire a server-side OpenCode Zen request path with safe error handling.
- [ ] Verify the phase in the browser and record results in Progress Notes.

## Builder Inputs Needed

- Local OpenCode Zen credentials before live API integration is completed.

## Tests And Checks

- `vitest` unit tests for topic-length validation and conversation payload shaping.
- Browser verification of the end-to-end duel flow.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- None.
