# Phase 05: Memory Candidate Generation

Status: NOT STARTED

## Purpose

Test whether journal options are interesting enough to become a core mechanic before asking the player to curate them.

## Scope

- After each conversation, generate memory candidates for both participating characters.
- Enforce the memory format rules: single sentence, 15 words or fewer, and `NEW` or `UPDATE` labeling.
- Include prior-entry context when proposing an `UPDATE`.
- Randomize the actual count shown per character within the intended range while preserving a consistent UI contract.

## Out Of Scope

- Player selection of memories.
- Long-term journal persistence across multiple conversations.
- Forgetting mechanics.

## Acceptance Criteria

- Each participating character produces formatted memory candidates after a conversation.
- The UI clearly distinguishes `NEW` versus `UPDATE` candidates and shows replaced text when relevant.
- The generated candidates are visible in the browser immediately after the conversation flow ends.

## Implementation Tasks

- [ ] Define the candidate-generation prompt contract and the local response-shaping rules.
- [ ] Add tests for candidate normalization, label validation, sentence-length enforcement, and update formatting.
- [ ] Implement the post-conversation memory candidate screen.
- [ ] Tune prompt instructions and response guards so malformed entries are rejected or repaired safely.
- [ ] Browser-verify that generated options are readable and narratively interesting.

## Builder Inputs Needed

- Confirm acceptable token-cost envelope if prompt or candidate counts need tuning.

## Tests And Checks

- `vitest` tests for candidate parsing and normalization.
- Browser verification of post-conversation candidate display.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- None.
