# Phase 03 — Game Logic Engine

**Status:** DONE (2026-03-15)
**Depends on:** Phase 01 (project setup)

## Goal
Build the pure game logic layer — no DOM, no API calls, no file I/O. This is the brain of the game. Because it has no side effects, it is the most thoroughly testable part of the codebase.

## What Gets Built

### 1. `src/engine/randomSelector.js`
Handles all random selections that happen at the start of each day.

Functions:
- `selectPoltergeistTarget(characters)` → returns `"husband"` or `"wife"` at random
- `selectConversationRooms(previousDayRooms)` → returns `{ coupleRoom, poltergeistRoom }` where:
  - Neither room is `"mystery-room"`
  - Neither room was used the previous day (unless it's day 1)
  - The two rooms are different from each other
  - Picks from: `["bedroom", "kitchen", "living-room"]`
- `selectConversationStarter()` → returns `"husband"` or `"wife"` at random

### 2. `src/engine/conversationEngine.js`
Manages conversation state and turn tracking.

Functions:
- `createConversation(participants, room, maxTurns)` → returns a new conversation state object
- `addTurn(conversation, speaker, message)` → returns updated conversation state
- `isConversationComplete(conversation)` → returns `true` when max turns reached
- `getTurnCount(conversation, character)` → returns how many turns a character has taken
- `isNearingEnd(conversation)` → returns `true` when within 2 turns of the limit (used to prompt characters to wrap up)

Conversation state shape:
```js
{
  id: string,           // unique id (e.g. "day-1-couple")
  participants: string[],
  room: string,
  maxTurns: number,
  turns: [{ speaker: string, message: string, timestamp: number }],
  complete: boolean
}
```

### 3. `src/engine/dayManager.js`
Tracks the overall game state across days.

Functions:
- `createGameState(config)` → returns initial game state
- `startDay(gameState)` → returns new state with today's random selections applied
- `completeActivity(gameState, activity)` → marks an activity as done, returns updated state. Activities: `"couple-conversation"`, `"poltergeist-conversation"`, `"memory-writing"`, `"diabolical-planning"`, `"sleep"`
- `isGameOver(gameState)` → returns `true` when day > 10
- `getCurrentDay(gameState)` → returns current day number (1–10, then 11 for end game)

Game state shape:
```js
{
  currentDay: number,
  totalDays: 10,
  characters: { husband: {...}, wife: {...}, poltergeist: {...} },
  today: {
    poltergeistTarget: string,
    coupleRoom: string,
    poltergeistRoom: string,
    conversationStarter: string,
    completedActivities: string[]
  },
  previousDayRooms: string[] | null
}
```

### 4. `src/engine/memoryEngine.js`
Handles memory constraints and selection logic (the selection itself is done by the LLM, but the engine enforces the rules).

Functions:
- `getMemoryItems(memoryText)` → parses a memory markdown file and returns an array of memory items (one per line, stripping empty lines)
- `applyMemoryUpdate(currentItems, newItems, discardedItems, maxItems)` → returns the updated list of items after applying LLM selections. Throws if constraints are violated (e.g., result exceeds maxItems).
- `formatMemoryFile(items)` → returns a string ready to write back to the memory markdown file
- `isAtCapacity(items, maxItems)` → returns `true` if memory is full

## Tests

`tests/engine/randomSelector.test.js`:
- `selectConversationRooms` never returns mystery-room
- `selectConversationRooms` never returns the same room twice
- `selectConversationRooms` excludes the previous day's rooms
- `selectPoltergeistTarget` returns only valid characters
- Test distribution is roughly even (run 100 times and check both values appear)

`tests/engine/conversationEngine.test.js`:
- Creating a conversation gives it the right shape
- Adding a turn increments turn count
- `isConversationComplete` returns true only at max turns
- `isNearingEnd` returns true within 2 turns of max
- Turn count per character is tracked correctly

`tests/engine/dayManager.test.js`:
- `createGameState` returns day 1
- `startDay` populates `today` with random selections
- `completeActivity` marks activities correctly
- `isGameOver` returns false before day 11, true at/after day 11
- `startDay` does not allow starting day > 11

`tests/engine/memoryEngine.test.js`:
- `getMemoryItems` correctly parses a multi-line markdown string
- `applyMemoryUpdate` rejects updates that exceed maxItems
- `applyMemoryUpdate` correctly removes discarded items and adds new ones
- `formatMemoryFile` produces clean output

> **TDD order:** Write all test files first. Run `npm test` — all fail. Implement the engine files one by one, re-running tests until all pass.

## User Testing Instructions
After this phase:
1. Run `npm test` — all engine tests pass
2. There is no visible UI change yet — this phase is logic only

## Acceptance Criteria
- [ ] All engine functions exist and are exported
- [ ] All tests pass with `npm test`
- [ ] No DOM, no fetch, no file I/O in any engine file

## Divergences
_None yet._
