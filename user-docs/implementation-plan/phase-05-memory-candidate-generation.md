# Phase 05: Memory Candidate Generation

Status: COMPLETED

## Purpose

Test whether journal options are interesting enough to become a core mechanic before asking the player to curate them.

## Scope

- After each conversation, generate memory candidates for both participating characters once the current progressive transcript flow reaches its end state.
- Enforce the memory format rules: single sentence, 15 words or fewer, and `NEW` or `UPDATE` labeling.
- Include prior-entry context when proposing an `UPDATE`.
- Randomize the actual count shown per character within the intended range while preserving a consistent UI contract.
- Present the candidate stage as a new scene in the current flow rather than as an inline add-on to the transcript list.

## Out Of Scope

- Player selection of memories.
- Long-term journal persistence across multiple conversations.
- Forgetting mechanics.

## Acceptance Criteria

- Each participating character produces formatted memory candidates after a conversation.
- The UI clearly distinguishes `NEW` versus `UPDATE` candidates and shows replaced text when relevant.
- The generated candidates are visible in the browser immediately after the conversation flow ends and the transition into the next scene feels intentional on desktop and mobile.

## Implementation Tasks

- [x] Define the candidate-generation prompt contract and the local response-shaping rules.
- [x] Add tests for candidate normalization, label validation, sentence-length enforcement, and update formatting.
- [x] Implement the post-conversation memory candidate scene and its transition from the current conversation view.
- [x] Tune prompt instructions and response guards so malformed entries are rejected or repaired safely.
- [x] Browser-verify that generated options are readable and narratively interesting.

## Builder Inputs Needed

- Confirm acceptable token-cost envelope if prompt or candidate counts need tuning.

## Tests And Checks

- `vitest` tests for candidate parsing and normalization.
- Browser verification of post-conversation candidate display.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.
- 2026-06-01: Phase 05 implementation started. The first pass will keep journal context local to the active browser session and seed each character with a small baseline memory list so `UPDATE` candidates can be generated before Phase 06 adds player-managed journal curation.
- 2026-06-01: Completed the first shipped pass. Memory candidates now generate through a dedicated server route and appear in a separate post-conversation scene with `NEW` and `UPDATE` styling plus replaced-entry copy.
- 2026-06-01: Browser-verified the transition and candidate presentation on desktop and mobile viewports using mocked local API responses because `OPENCODE_ZEN_KEY` was not available in the local environment.

## Divergences

- 2026-06-01: Phase 05 now assumes the shipped progressive conversation loop and scene-based UI. Memory candidates should enter as a dedicated next scene after transcript completion, not as an appendage to the older single-page flow.
- 2026-06-01: Phase 05 introduces a seeded per-character baseline journal in browser session state so `UPDATE` candidates have valid replacement targets before Phase 06 adds player-managed journal curation and journal mutation.
