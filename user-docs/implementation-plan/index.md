# Implementation Plan

Source documents:

- `user-docs/idea/idea-v6.md`

## Current Status

- Current phase: Phase 04 - Room Effects
- Overall status: Phases 1 through 3 are complete. The app now uses a scene-based setup flow, progressive turn generation with player-driven reveal, a forest-cabin visual direction with portrait and room artwork, and per-session character customization with inspectable personalities.
- Last updated: 2026-06-01

## Phase Signpost

| Phase | Status | Purpose | Phase file |
| --- | --- | --- | --- |
| 01 | COMPLETED | Prove the core loop with a minimal live AI conversation slice. | `phase-01-character-duel-prototype.md` |
| 02 | COMPLETED | Reframe player choices and the duel screen as a card game. | `phase-02-trading-card-presentation.md` |
| 03 | COMPLETED | Let the player rename characters and shape their personalities. | `phase-03-character-creation.md` |
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
| 03 | COMPLETED | None. | N/A |
| 05 | NEEDED LATER | Confirm acceptable token-cost envelope for memory generation if prompt sizes or turn counts need tuning. | Cost-safe memory candidate generation. |
| 10 | NEEDED LATER | Choose deployment target, runtime, and secret-hosting approach before release hardening begins. | Final deployment-oriented implementation and operational docs. |
| 12 | NEEDED LATER | Provide or approve final audio assets and licensing approach if non-generated sounds are used. | Production-ready sound pass. |

## Divergence Log

| Date | Phase | Decision | Reason | Impact |
| --- | --- | --- | --- | --- |
| 2026-05-30 | 01 | Re-opened Phase 1 for usability and presentation refinements after the first live slice. | Early browser testing exposed UX friction in transcript pacing and topic entry. | Phase 1 remains the active implementation surface until the replay and transcript UX are stable. |
| 2026-05-31 | 02 | Shifted Phase 2 from a simultaneous side-panel setup to a stepped card flow with backtracking and a final confirmation screen. | The side-panel layout felt too much like a form and hid the sense of staged choice the phase is meant to introduce. | Phase 2 now focuses on progressive setup screens, explicit review before conversation start, and mobile-friendly card navigation. |
| 2026-05-31 | 02 | Changed transcript pacing from time-based auto-advance to player-driven reveal after the full transcript is generated. | Automatic playback outran reading speed during manual playtesting. | Conversation requests still generate the full transcript up front, but the UI now reveals one turn per tap/click to preserve readability on desktop and mobile. |
| 2026-06-01 | 02 | Replaced the split-screen presentation with a forest-cabin scene flow and locked the approved palette artifact under `user-docs/design-direction/phase-02-forest-cabin/`. | The previous redesign still felt like a dashboard with a header bolted on top rather than a staged playable experience. | Phase 2 keeps the same gameplay loop, but the visual system, page structure, and card motion now follow the approved cabin-in-clearing direction. |
| 2026-06-01 | 02 | Reworked transcript delivery from full upfront generation to progressive background generation with immediate first-turn display. | Waiting for the complete conversation before showing anything still made the start of play feel sluggish and over-exposed an implementation detail to the player. | Later phases should assume the conversation loop is progressive: the first turn can appear immediately, later turns can continue generating in the background, and loading states are player-facing only when they advance faster than generation completes. |
| 2026-06-01 | 02 | Replaced the SVG-only card art direction with generated portrait and room images where richer scene illustration mattered. | The shipped forest-cabin presentation needed fuller scene and portrait treatment than the earlier SVG approach could provide, and the user explicitly rejected the SVG look. | Future phases should treat bitmap scene/portrait art as a first-class part of the product while still using SVG where it remains the best fit for lightweight UI-native assets. |

## Agent Notes

- Keep this index synchronized with every phase file.
- Keep Builder Handoffs current so blockers are obvious before implementation stalls.
- Record user-requested plan changes in the Divergence Log before or alongside implementation.
