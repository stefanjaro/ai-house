# Phase 06 — Memory System

**Status:** DONE — 2026-03-15
**Depends on:** Phase 04 (file service), Phase 05 (LLM service)

## Goal
Implement the end-of-day memory writing flow for all three characters. Each character reviews the day's conversations and uses an LLM call to decide what to remember. The result is written back to their memory file. The engine enforces the memory capacity rules.

## What Gets Built

### 1. `src/services/memoryService.js`

```js
export const memoryService = {
  // Runs one character's memory reflection
  async reflectAndUpdate({
    character,           // "husband", "wife", or "poltergeist"
    dayConversations,    // array of transcript strings from today
    config,
    personality,
    currentMemory,       // current items array (from memoryEngine.getMemoryItems)
    maxNewItems,         // 5 for husband/wife, 2 for poltergeist
    maxTotalItems,       // 20 for husband/wife, 10 for poltergeist
    onThought(chunk),    // streaming callback — "thoughts" appear on screen
    onComplete(updatedMemoryText),
  })
}
```

**LLM prompt construction:**
- Provide the character's personality + current memory items + today's conversation transcripts
- Ask the LLM to: (a) choose up to `maxNewItems` things to remember, and (b) if at capacity, choose `maxNewItems` existing items to discard
- Ask for a structured response (a simple numbered list for new items, a numbered list for discards)
- The response is parsed, validated with `memoryEngine.applyMemoryUpdate`, and then written back to disk via `fileService.setMemory`

**Streaming:** The LLM's response should stream in via `onThought(chunk)` — this is what gets displayed as the character's "thoughts" on screen.

### 2. Tests

`tests/services/memoryService.test.js`:
- When below capacity: only new items are added, no discards required
- When at capacity: discard items are removed and new items are added; total does not exceed max
- If LLM returns malformed output, the error is caught and the memory is left unchanged (with a logged warning)
- `onThought` callback is called at least once during reflection
- Memory file is written after reflection completes

> **TDD order:** Write tests with mocked LLM and fileService. Run — fail. Implement — run until passing.

## User Testing Instructions
After this phase:
1. `npm test` — all tests pass
2. Live test: run `npm run server`, then manually trigger a memory reflection via a temporary test script or browser console. Verify:
   - Streamed "thoughts" appear
   - `data/memory/husband-memory.md` is updated with new content
   - Total items do not exceed the limit

## Acceptance Criteria
- [ ] Memory reflection runs correctly for all three characters
- [ ] Capacity constraints are enforced
- [ ] Memory file is written to disk after each reflection
- [ ] `npm test` passes

## Divergences
_None yet._
