# Phase 04 — LLM Integration & Conversation Engine

**Status:** `[ ] TODO`
**Depends on:** Phase 03 complete and tested
**Goal:** Characters can hold real LLM-powered conversations, displayed on screen, with turn limits and word limits enforced.

---

## What You'll Be Able to Test

After this phase you will see:
- A test conversation triggered by a keyboard shortcut (e.g., `C` key)
- The husband and wife hold a conversation in the living room: turns alternate, each turn appears as a dialogue bubble above the speaking character
- The conversation ends after 20 turns (or when characters wrap up naturally)
- A separate test triggers a poltergeist conversation (10 turns)
- Conversation logs are written to `data/logs/husband-wife-conversations/` and `data/logs/poltergeist-conversations/`
- If an API call fails, an error message appears on screen (the game does not crash)

---

## What Gets Built

### 1. LLM Client (`src/llm/LLMClient.js`)

A thin wrapper around `fetch` that:
- Reads the character's config (API key, endpoint, model) from the loaded `api-config.json`
- Sends a chat completion request in OpenAI-compatible format (works with any OpenAI-compatible endpoint)
- Returns the response text
- Handles errors gracefully (network errors, 4xx/5xx responses)

```javascript
// Usage example:
const client = new LLMClient('husband', apiConfig);
const reply = await client.chat(messages); // messages = [{role, content}]
```

### 2. Conversation Engine (`src/llm/ConversationEngine.js`)

Orchestrates a full conversation between two characters. Responsibilities:
- Maintains the conversation message history
- Alternates turns between participants
- Enforces the turn limit (passed in as a parameter: 20 for husband/wife, 10 for poltergeist)
- Enforces the 50-word-per-turn limit via the system prompt
- Injects turn-limit awareness: when a character is on their penultimate turn, their system prompt includes a note that this is their second-to-last turn and they should begin wrapping up; on their last turn, they must conclude
- Returns the full conversation transcript when done

#### System Prompt Construction

Each character's system prompt is assembled from:
1. Their personality (`data/personalities/x-personality.md`)
2. Their current memory (`data/memories/x-memory.md` — empty on day 1)
3. The room influence for the room they're in (`data/room-influences/x-room-influence.md`)
4. Conversation rules injected automatically:
   ```
   You are in a conversation. Each of your responses must be 50 words or fewer.
   This conversation has a maximum of [N] turns total ([N/2] per person).
   You are currently on turn [X] of [N/2]. [If penultimate: Begin wrapping up the conversation. If last: This is your final turn — conclude the conversation.]
   ```

### 3. Dialogue Display (`src/ui/DialogueOverlay.js`)

As each turn completes, the spoken text appears on screen:
- A speech bubble rendered above the speaking character's sprite
- The character's name shown in the bubble header
- Text appears character-by-character (typewriter effect, ~40 chars/second)
- After the typewriter effect completes, a brief pause (1.5 seconds), then the next turn begins
- Only one bubble shown at a time; previous bubble fades out before the next appears

### 4. Conversation Logger (`src/llm/ConversationLogger.js`)

After a conversation ends, writes a log file:

**Filename format:** `YYYY-MM-DD_day-N_room-name.md`

**Log format:**
```markdown
# Conversation Log
**Day:** 3
**Room:** Living Room
**Participants:** Alice & Bob
**Date:** 2026-03-14T14:32:00Z

---

**Alice:** Hello, how was your day?

**Bob:** It was lovely, thank you for asking...

[... all turns ...]
```

**Storage locations:**
- Husband/wife conversations → `data/logs/husband-wife-conversations/`
- Poltergeist conversations → `data/logs/poltergeist-conversations/`

### 5. Word Count Enforcement

The 50-word limit is enforced at two levels:
1. **Prompt-level:** The system prompt instructs the model to stay within 50 words
2. **Post-processing:** If a response exceeds 60 words (allowing a small buffer for natural sentence endings), it is truncated at the last complete sentence within 50 words. A warning is logged to the browser console.

---

## Technical Notes

### OpenAI-Compatible API Format

The request body sent to any endpoint:
```json
{
  "model": "model-name-from-config",
  "messages": [
    {"role": "system", "content": "...assembled system prompt..."},
    {"role": "user", "content": "...previous turn..."},
    {"role": "assistant", "content": "...character's previous response..."},
    ...
  ],
  "max_tokens": 150,
  "temperature": 0.8
}
```

### CORS Considerations

If your API endpoint blocks browser requests due to CORS, the Vite dev server will be configured with a proxy to forward API calls. This is transparent to you — if it's needed, I'll handle it in the Vite config.

---

## Your Actions Required

1. Ensure your `config/api-config.json` has valid API keys before testing this phase.
2. Press `C` in the game to trigger a test conversation and watch it play out.
3. After the conversation ends, check `data/logs/husband-wife-conversations/` for the generated log file.
4. Report back if:
   - The conversation feels too fast or too slow (typewriter speed is adjustable)
   - Responses feel too long or too short
   - Any API errors appear on screen

---

## Divergences from Original Spec

_None._
