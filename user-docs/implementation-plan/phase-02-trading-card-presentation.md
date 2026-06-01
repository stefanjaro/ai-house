# Phase 02: Trading Card Presentation

Status: COMPLETED

## Purpose

Convert the functional prototype into a presentation that feels like a turn-based card duel without expanding the gameplay loop yet.

## Scope

- Replace plain selection controls with card-based character, room, and starting-speaker choices presented as a stepped flow.
- Restyle the conversation screen so the exchange feels like a duel between two character cards while remaining comfortable on phones.
- Introduce SVG-based custom visual assets needed for cards or room motifs.
- Improve pacing and readability by generating the transcript up front and revealing one turn at a time only when the player advances.

## Out Of Scope

- Editable personalities.
- Journal mechanics.
- Additional game rules beyond the existing duel flow.

## Acceptance Criteria

- All major player decisions in the current loop are made through card-like UI components shown one choice set at a time.
- The player can backtrack through setup choices and sees a confirmation screen summarizing all selections before the conversation begins.
- The conversation screen clearly presents both active characters and the selected room.
- The conversation advances only when the player taps or clicks to reveal the next turn.
- The user can play the same Phase 01 flow in the browser with the new presentation.

## Implementation Tasks

- [x] Define the stepped card flow, layout primitives, and SVG asset needs.
- [x] Add tests for selection-state behavior, step navigation, and player-driven transcript reveal.
- [x] Implement card-based setup screens, confirmation review, and duel presentation.
- [x] Verify that the UI remains usable on desktop and mobile browser sizes.
- [x] Browser-test the updated loop and record what feels stronger or weaker than Phase 01.

## Builder Inputs Needed

- None.

## Tests And Checks

- `vitest` component or DOM-focused tests for card selection behavior.
- Browser verification of setup flow, responsive layout, and duel readability.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.
- 2026-05-31: Began implementation. Locked the phase to a stepped card-selection flow with backtracking, a confirmation screen, player-driven transcript reveal, and a lighter responsive presentation after rejecting the existing side-panel layout during review.
- 2026-05-31: Replaced the side-panel setup with a five-step card flow for character pair, room, opener, topic, and final review. The setup now supports backtracking before conversation generation, and the duel view preserves the chosen staging after the transcript loads.
- 2026-05-31: Changed transcript pacing so the full ten-turn conversation is generated immediately but stays hidden until the player taps or clicks to reveal each next turn. This makes the loop readable during playtesting without changing the provider contract.
- 2026-05-31: Shifted the presentation to a lighter, more playful interface with SVG card glyphs, responsive layout behavior, and an SVG favicon to remove the browser 404 from the final app shell.
- 2026-05-31: Verified `npm test`, `npm run build`, a live `POST /api/conversations` request against the local API, and Playwright browser passes at desktop (`1280x900`) and mobile (`390x844`). Confirmed backtracking, confirmation review, no horizontal overflow at those sizes, and tap-to-advance transcript reveal from 0 to 2 visible turns during verification.
- 2026-06-01: Locked a new art direction after rejecting the previous darker lounge and apartment variants. The approved reference is a lighter forest-cabin-in-a-sunlit-clearing palette with atmosphere-first framing and carved-object cards, saved under `user-docs/design-direction/phase-02-forest-cabin/`.
- 2026-06-01: Rebuilt the layout as scene-based full-screen stages instead of a persistent split-screen shell. Setup now reads as a sequence of cabin-table vignettes with compact progress framing rather than a page with a large hero and side panel.
- 2026-06-01: Added spring-lift card motion through hover, press, and selected-state animation while keeping transcript pacing player-driven.
- 2026-06-01: Re-verified `npm test`, `npm run build`, and Playwright browser passes at desktop (`1280x900`) and mobile (`390x844`). Confirmed no horizontal overflow, stacked mobile actions, final-review visibility, explicit reveal from 0 to 2 turns, and active hover motion on selection cards after reload.
- 2026-06-01: Removed the remaining setup banner copy after review because it repeated information that should already be visible in the selectable cards. The confirmation step remains the only place where the full staged summary is shown before conversation start.
- 2026-06-01: Reworked transcript generation from a full-transcript preload to progressive turn generation. The first turn now appears as soon as it is generated, later turns continue generating in the background, and the UI shows `Loading…` only when the player advances faster than generation completes.
- 2026-06-01: Rebuilt the confirmation screen after review to remove repeated metadata boxes. The final review now uses a single room-art hero, a compact pair/opener summary, and the topic as the only separate callout.
- 2026-06-01: Added custom SVG room illustrations and wired them into the room-selection cards, confirmation screen, and conversation stage so the game now carries bespoke visual assets through the main flow instead of relying on text and generic glyphs alone.
- 2026-06-01: Replaced the generic character glyph treatment with generated portrait art for Elias, Mara, and Jonah. The portraits now appear on character setup cards, the opening-speaker step, the confirmation screen, the conversation header strip, and each revealed transcript turn.
- 2026-06-01: Simplified the selected-card highlight after review by removing the green gradient wash and moving emphasis into cleaner border and framing treatment so room and character selections read more clearly without overwhelming the forest-cabin palette.
- 2026-06-01: Regenerated the character portraits to feel less glam and more grounded, while also varying the cast visually. Converted both character and room artwork to smaller JPEG runtime assets and removed the obsolete large PNG and room SVG files from `public/`.

## Divergences

> **DIVERGENCE:** The original Phase 2 description assumed a card-themed version of the existing side-panel setup. Implementation is instead using a one-step-at-a-time card flow with explicit backtracking and a final confirmation screen because that better matches the desired feeling of staging a duel rather than filling out a form.

> **DIVERGENCE:** Phase 2 is pulling transcript pacing deeper into the presentation work than originally written. Instead of timed auto-play with loading beats, the app now generates the full transcript first and reveals each turn only when the player clicks or taps, because readability during manual playtesting matters more than passive animation.

> **DIVERGENCE:** The first completed Phase 2 visual pass was replaced immediately afterward. The user rejected both the original split-screen composition and subsequent dark lounge / aged apartment palette explorations, so the shipped direction is now a forest-cabin scene flow with lighter daylight values, carved-object cards, and a saved palette artifact for future reference.

> **DIVERGENCE:** The final shipped transcript behavior differs from the earlier Phase 2 rewrite. Instead of waiting for the full transcript before any reveal, the app now generates turns progressively so the first message can appear immediately and only later clicks may hit a visible loading state.

> **DIVERGENCE:** The original phase language called for SVG custom visuals, but the final character and room art now uses generated PNG illustrations because the user explicitly rejected the SVG look and wanted richer image-based scene and portrait assets in the UI.
