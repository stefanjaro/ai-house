# Phase 07 - Conversation Presentation

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Build the RPG-style conversation experience with mock dialogue before connecting real LLM calls.

## Scope

- Let the player choose which selected character begins.
- Let the player enter a conversation topic of no more than 25 words.
- Render dialogue as streaming/scrawling text in a speech bubble or overlay.
- Advance speaker turns by click or keyboard input.
- Support bracketed action text visually without treating it as a separate speaker.
- Show conversation completion and hand off to journal review.

## Tests First

Write tests before implementation for:

- Topic word-count validation.
- Starting speaker selection.
- Conversation turn ordering.
- Text scrawl state and click-to-complete behavior.
- Bracketed action text remains in the displayed line.

## Implementation Notes

- Use deterministic mock dialogue fixtures in this phase.
- Keep presentation logic separate from LLM transport so Phase 09 can plug in real responses.
- Avoid long blocking animations; players should be able to advance comfortably.

## Browser Verification

- Run a mock conversation from start to finish.
- Confirm text streams visibly, click-to-advance works, and speaker identity is clear.
- Confirm topic validation in the UI.

## Acceptance Criteria

- Conversation presentation feels like the intended top-down RPG style.
- No LLM calls are required to test the flow.
- UI can pass completed transcript data to journal systems.

## Divergence Log

No divergences yet.

