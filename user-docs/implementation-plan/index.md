# Implementation Plan

Source documents:

- `user-docs/idea/idea-v6.md`

## Current Status

- Current phase: Phase 01 - Character Duel Prototype
- Overall status: Planning complete. Implementation has not started.
- Last updated: 2026-05-29

## Phase Signpost

| Phase | Status | Purpose | Phase file |
| --- | --- | --- | --- |
| 01 | NOT STARTED | Prove the core loop with a minimal live AI conversation slice. | `phase-01-character-duel-prototype.md` |
| 02 | NOT STARTED | Reframe player choices and the duel screen as a card game. | `phase-02-trading-card-presentation.md` |
| 03 | NOT STARTED | Let the player rename characters and shape their personalities. | `phase-03-character-creation.md` |
| 04 | NOT STARTED | Make room selection meaningfully alter conversation behavior. | `phase-04-room-effects.md` |
| 05 | NOT STARTED | Generate post-conversation journal candidates worth curating. | `phase-05-memory-candidate-generation.md` |
| 06 | NOT STARTED | Turn journals into visible player-managed state. | `phase-06-memory-curation.md` |
| 07 | NOT STARTED | Feed curated journals back into future conversations. | `phase-07-memory-driven-conversations.md` |
| 08 | NOT STARTED | Add the two-conversation daily structure and constraints. | `phase-08-day-structure.md` |
| 09 | NOT STARTED | Introduce probabilistic forgetting and visible memory loss. | `phase-09-forgetting.md` |
| 10 | NOT STARTED | Complete the Day 10 ending and summary flow. | `phase-10-day-10-ending.md` |
| 11 | NOT STARTED | Improve the art direction, motion, and readability once the loop is fun. | `phase-11-visual-polish.md` |
| 12 | NOT STARTED | Layer in sound as a final enhancement pass. | `phase-12-sound.md` |

## Sequencing Notes

- Treat each phase as a stop point for manual playtesting before proceeding.
- Favor mocked or fixture-backed development only when it shortens feedback time without hiding core gameplay risk.
- Lock server/client secret boundaries before wiring live LLM calls into the browser UI.
- Keep plan files current when the implementation proves a phase should be split, merged, or reordered.

## Builder Handoffs

| Phase | Status | Needed From Builder | Unblocks |
| --- | --- | --- | --- |
| 01 | NEEDED LATER | Provide local OpenCode Zen credentials and any model usage constraints before live conversation integration. Mock conversations can unblock UI-first work temporarily. | End-to-end AI duel prototype with real personalities. |
| 03 | NOT NEEDED | None if character creation remains local-only. | N/A |
| 05 | NEEDED LATER | Confirm acceptable token-cost envelope for memory generation if prompt sizes or turn counts need tuning. | Cost-safe memory candidate generation. |
| 10 | NEEDED LATER | Choose deployment target, runtime, and secret-hosting approach before release hardening begins. | Final deployment-oriented implementation and operational docs. |
| 12 | NEEDED LATER | Provide or approve final audio assets and licensing approach if non-generated sounds are used. | Production-ready sound pass. |

## Divergence Log

| Date | Phase | Decision | Reason | Impact |
| --- | --- | --- | --- | --- |

## Agent Notes

- Keep this index synchronized with every phase file.
- Keep Builder Handoffs current so blockers are obvious before implementation stalls.
- Record user-requested plan changes in the Divergence Log before or alongside implementation.
