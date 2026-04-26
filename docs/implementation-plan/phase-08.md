# Phase 08 - Journals and Forgetting

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Implement the journal system that acts as each character's memory, including entry updates and overnight forgetting.

## Scope

- Store per-character journal entries.
- Enforce entries of one sentence and no more than 25 words.
- Generate or accept 3 to 5 entry changes after a conversation.
- Support updating historical entries to avoid contradictions.
- Show the player the journal changes immediately after a conversation.
- Hide full journals during normal gameplay except for the post-conversation review and final ending.
- Apply overnight forgetting probabilities at end of day.
- Track forgotten entries for the final Day 10 recap.

## Tests First

Write tests before implementation for:

- Journal entry validation.
- Random count selection between 3 and 5 with injectable randomness.
- Add/update operations.
- Contradiction-resolution operation shape.
- Forgetting probability selection with injectable randomness.
- Final history includes active and forgotten entries.

## Implementation Notes

- Keep randomness injectable for deterministic tests.
- The v5 idea says only one forgetting outcome can happen per character per night; encode this explicitly.
- Treat LLM-generated journal suggestions as untrusted input and validate before applying.
- Use "journal" terminology throughout user-facing UI.

## Browser Verification

- Complete a mock conversation.
- Confirm journal changes are shown after the conversation.
- End a day and verify forgetting feedback is clear enough for the player to understand.
- Confirm full journal browsing is not available during ordinary gameplay.

## Acceptance Criteria

- Journal state can drive later prompts.
- Forgetting is tested and deterministic under seeded/injected randomness.
- The final recap has enough data to show remembered and forgotten entries.

## Divergence Log

No divergences yet.

