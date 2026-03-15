# Phase 05 — LLM Service & Conversation Engine

**Status:** DONE (2026-03-15)
**Depends on:** Phase 02 (config), Phase 03 (conversation engine), Phase 04 (file service)

## Goal
Build the layer that calls LLM APIs with streaming, orchestrates multi-turn conversations between characters, and writes logs to disk. By the end of this phase the game can run a full conversation (husband + wife, or poltergeist + one character) end-to-end and save the transcript.

## What Gets Built

### 1. `src/services/llmService.js`
Handles streaming calls to any OpenAI-compatible endpoint.

```js
export const llmService = {
  // Returns an async generator that yields text chunks as they stream in
  streamCompletion({ endpoint, apiKey, model, messages, onChunk, onComplete })
}
```

- Uses the native `fetch` API with `ReadableStream` to handle streaming
- `onChunk(text)` callback called with each text delta as it arrives
- `onComplete(fullText)` callback called when the stream ends
- See `docs/api/opencode-zen.md` for the endpoint format being used
- **Important:** thinking models (e.g. `kimi-k2.5`) return both `content` and `reasoning_content` in each chunk. Only `content` should be passed to `onChunk` — `reasoning_content` must be ignored.

### 2. `src/services/conversationOrchestrator.js`
Coordinates multi-turn conversations between two characters using the LLM service and game engine.

```js
export const conversationOrchestrator = {
  // Runs a full conversation, emitting turn-by-turn via callbacks
  async runConversation({
    participants,       // e.g. ["husband", "wife"]
    room,               // e.g. "bedroom"
    config,             // from fileService.getConfig()
    personalities,      // { husband: string, wife: string }
    memories,           // { husband: string, wife: string }
    roomInfluence,      // string
    maxTurns,           // e.g. 20 for couple, 10 for poltergeist
    onTurnStart(speaker),
    onChunk(speaker, chunk),
    onTurnComplete(speaker, fullText),
    onConversationComplete(transcript),
  })
}
```

**System prompt construction:**
Each character's system prompt = personality + memory + room influence + turn limit awareness instruction.

**Turn limit awareness:** When `isNearingEnd(conversation)` returns true, append to the next prompt: `"(You have only {N} turns remaining. Begin wrapping up the conversation naturally.)"`.

**Conversation flow:**
1. Load all context (personalities, memories, room influence) via `fileService`
2. Randomly determined starter goes first (passed in via `participants[0]`)
3. Alternate turns until `isConversationComplete` returns true
4. Save transcript via `fileService.saveConversationLog`

### 3. `src/services/diabolicalPlanner.js`
Runs the poltergeist's solo monologue in the mystery room.

```js
export const diabolicalPlanner = {
  async runMonologue({
    config,
    personality,
    memory,
    previousPlan,   // optional: last monologue text to give continuity
    onChunk(chunk),
    onComplete(text),
  })
}
```

The system prompt instructs the poltergeist to reflect on what happened today and plan their next move. The output is a short theatrical monologue (max ~150 words).

### Testing Notes
LLM calls cannot be unit tested against real APIs in CI. Instead:
- Write integration-style tests in `tests/services/llmService.test.js` that use a **mock fetch** to simulate a streaming SSE response and verify that `onChunk` is called multiple times and `onComplete` is called with the full assembled text.
- Write tests in `tests/services/conversationOrchestrator.test.js` that mock `llmService.streamCompletion` and `fileService` and verify:
  - Turn alternation is correct
  - `isNearingEnd` triggers the wrap-up instruction
  - Conversation stops at maxTurns
  - Log is saved after completion

> **TDD order:** Write mocked tests first. Run — fail. Implement. Run — pass.

## User Testing Instructions
After this phase:
1. Ensure `config.json` has valid API credentials
2. Run the test suite: `npm test` — all mocked tests pass
3. To do a live end-to-end test, run a temporary script (`npm run test:live` or similar) that calls `conversationOrchestrator.runConversation(...)` and prints streamed output to the console. Verify:
   - Text streams in word-by-word (not all at once)
   - Conversation stops at the turn limit
   - A log file appears in `data/husband-wife-conversations/`

## Acceptance Criteria
- [ ] `llmService` streams correctly (verified via mocked test)
- [ ] `conversationOrchestrator` correctly alternates turns and enforces limits (mocked test)
- [ ] Turn wrap-up instruction is injected near the end (mocked test)
- [ ] Conversation log is saved to disk after completion
- [ ] `npm test` passes

## Divergences

> **DIVERGENCE — Conversation speech style:** After live testing, the characters spoke in archaic medieval language and put internal thoughts in asterisks. The system prompt was updated to: (1) require plain modern-day conversational English, (2) prohibit writing internal thoughts entirely, and (3) restrict asterisks to visible physical actions only (e.g. *smiles*). This applies to all character conversations via `conversationOrchestrator`.
