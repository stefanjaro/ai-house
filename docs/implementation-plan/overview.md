# AI House Implementation Plan Overview

Source idea: `docs/idea/idea-v5.md`  
Status key: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `DONE`

This folder is the working memory for implementation. Update the relevant phase file whenever work starts, finishes, or diverges from the v5 idea. If the phase list changes, update this overview and add or revise the matching phase file.

## Phase Summary

| Phase | Status | Completion Date | Focus | Outcome |
| --- | --- | --- | --- | --- |
| 00 | NOT STARTED | - | Project foundation | Vite, Express, Vitest, baseline scripts, gitignored local config/data scaffolding. |
| 01 | NOT STARTED | - | Visual direction and SVG asset system | Modern apartment visual language, scalable SVG asset conventions, first testable static scene. |
| 02 | NOT STARTED | - | Apartment layout and collision map | Four-room top-down apartment, hallway, altar room contrast, walkable/non-walkable geometry. |
| 03 | NOT STARTED | - | Character sprites and movement feel | Three SVG characters, idle/walk states, path preview, room-to-room travel animation. |
| 04 | NOT STARTED | - | App shell and screen flow | Start, setup, game, and ending screens wired with a lightweight router. |
| 05 | NOT STARTED | - | Character creation and local config | Names, personality editing, API key capture, defaults, validation, local persistence. |
| 06 | NOT STARTED | - | Day planning flow | Start-of-day and middle-of-day character pair/room selection with rule enforcement. |
| 07 | NOT STARTED | - | Conversation presentation | RPG-style conversation overlay, streaming text feel, click-to-advance, mock dialogue mode. |
| 08 | NOT STARTED | - | Journals and forgetting | Journal entry creation/update rules, overnight forgetting, final journal history. |
| 09 | NOT STARTED | - | LLM integration | OpenCode Zen GPT-5.4-Nano calls, prompt assembly, response parsing, error states. |
| 10 | NOT STARTED | - | Full day loop and endgame | Two conversations per day, Day 10 ending, final recap, no-save run lifecycle. |
| 11 | NOT STARTED | - | Audio and atmosphere | Ambient loops, footsteps, text sounds, volume controls, graceful mute/fallback behavior. |
| 12 | NOT STARTED | - | Playtest polish and packaging | Browser verification pass, tuning, accessibility, documentation for local play. |

## Architecture Targets

- Keep game rules in pure modules under `src/engine/`; cover them with Vitest before implementation.
- Keep browser rendering and user interaction under `src/ui/`; cover DOM behavior with jsdom tests where practical, then verify visually with Chrome DevTools MCP.
- Keep filesystem and LLM side effects behind services under `src/services/` and local Express endpoints in `server.js`.
- Use SVG assets developed in-repo for rooms, furniture, characters, and UI elements.
- Store local runtime files under `data/`; keep API keys and generated play data out of git.

## Non-Negotiables

- TDD: write or update tests before implementation code for each behavior.
- Visual-first: complete the visual foundation phases before implementing deeper game logic.
- Browser verification: before marking a phase `DONE`, run the app and confirm the feature through Chrome DevTools MCP.
- Divergences: when the live game changes away from `docs/idea/idea-v5.md`, add a `> **DIVERGENCE:**` block to the relevant phase file with the date and rationale.
- No deployment target: optimize for local browser play only.

