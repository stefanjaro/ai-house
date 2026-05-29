# Phase 07: Memory-Driven Conversations

Status: NOT STARTED

## Purpose

Prove that curated journals materially change later conversations, creating grudges, misunderstandings, and continuity across turns.

## Scope

- Inject relevant journal context into future conversation prompts.
- Decide and document how much journal history is included so prompt size stays bounded.
- Surface enough context in the UI for the player to understand why conversations changed.
- Preserve clear data boundaries for journals, personalities, and room context.

## Out Of Scope

- Two-conversation daily structure.
- Forgetting probabilities.
- Final game ending.

## Acceptance Criteria

- A later conversation visibly reflects earlier curated memories.
- The player can trace conversation changes back to journal content.
- Prompt size and journal selection rules are documented well enough to maintain.

## Implementation Tasks

- [ ] Define the journal-to-prompt selection strategy and record any material data-model choice in project docs.
- [ ] Add tests for journal context injection and bounded prompt assembly.
- [ ] Implement journal-aware conversation generation and explanatory UI cues.
- [ ] Browser-verify a before-and-after scenario where curated memories alter later dialogue.

## Builder Inputs Needed

- None.

## Tests And Checks

- `vitest` tests for prompt context assembly from journals.
- Browser verification of memory-driven continuity across multiple conversations.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- None.
