# Phase 09 - LLM Integration

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Connect conversations and journal updates to OpenCode Zen using GPT-5.4-Nano while keeping the app usable and debuggable locally.

## Scope

- Implement an OpenCode Zen client using the request/response format in `docs/api/opencode-zen.md`.
- Assemble prompts from character personality, active journal entries, room context, selected topic, and conversation history.
- Apply the altar room rule: characters in that room are influenced to act as the complete opposite of themselves.
- Stream or progressively display assistant output in the existing conversation UI.
- Parse model output into conversation turns and journal update proposals.
- Handle missing API key, network failure, malformed output, and cancellation gracefully.

## Tests First

Write tests before implementation for:

- Prompt assembly includes required context and excludes hidden/internal-only data.
- Altar room prompt transformation is present only for that room.
- API request body matches the documented OpenCode Zen shape.
- Response parser extracts displayed content and ignores unsupported fields.
- Error states produce recoverable UI/service results.

## Implementation Notes

- Use GPT-5.4-Nano as specified in v5.
- Keep API key handling local and out of logs.
- Prefer a strict response format for journal proposals if prompt reliability allows it.
- Never stream reasoning or provider metadata into the UI.

## Browser Verification

- With a valid local API key, run a real conversation.
- Confirm the UI streams or progressively reveals only player-facing content.
- Confirm journal proposals appear after the conversation.
- Test a missing/invalid API key path.

## Acceptance Criteria

- Real LLM conversations work in the existing day flow.
- Room, personality, topic, and journal context influence prompts.
- Failures are understandable and do not corrupt game state.

## Divergence Log

No divergences yet.

