# Phase 06 — Memory System

**Status:** `[ ] TODO`
**Depends on:** Phase 05 complete and tested
**Goal:** After each day's conversations, characters reflect and write their memories. The player sees this process on screen. Memories influence the next day's conversations.

---

## What You'll Be Able to Test

After this phase you will see:
- After the two conversations end, characters walk toward their memory locations
  - Husband and wife walk to the bedroom
  - Poltergeist walks toward the mystery room entrance (the memory phase for the poltergeist happens in Phase 07 alongside diabolical planning)
- A "Memory Writing" overlay appears on screen, starting with the wife
- The wife's "thoughts" stream on screen as she decides what to remember (typewriter effect)
- Her memory file is updated; then the husband goes through the same process
- Both memory files are capped at 20 items; if at capacity, 5 are discarded first
- After memory writing, the game proceeds to the poltergeist's turn (Phase 07)

---

## What Gets Built

### 1. MemoryManager (`src/game-loop/MemoryManager.js`)

Orchestrates the memory writing sequence for all three characters. Called by `DayManager` after both conversations complete.

Sequence:
```
1. Wife reflects → updates wife-memory.md
2. Husband reflects → updates husband-memory.md
3. (Poltergeist memory handled in Phase 07 DiabolicalPlanner)
```

### 2. Memory Reflection — LLM Call

For each character (husband, wife), a single LLM call is made with the following prompt structure:

**System prompt:**
```
[Character's personality]
[Character's current memory]
```

**User message:**
```
You've just had the following conversations today:

[Full transcript of husband/wife conversation]
[Full transcript of poltergeist conversation — only if this character was involved]

Based on these conversations, reflect on what happened. Choose the 5 most important or
meaningful things you want to remember going forward. These could be feelings, facts,
concerns, pleasant moments, or things that surprised you.

Present your reflection as a short thought process (2-3 sentences of inner monologue),
then list your 5 chosen memories as short bullet points (max 15 words each).

Format your response exactly like this:
REFLECTION: [your inner monologue here]
MEMORIES:
- [memory 1]
- [memory 2]
- [memory 3]
- [memory 4]
- [memory 5]
```

### 3. Memory File Format (`data/memories/x-memory.md`)

```markdown
# [Character Name]'s Memory

*Last updated: Day 3*

- Felt genuinely happy talking about our trip to the coast last year
- Wife seemed distant when I mentioned the kitchen renovation plans
- The poltergeist said something odd about trust — unsettled me
- ...
```

Maximum 20 items. Items are stored as a flat list. When capacity is reached, the character is prompted to choose 5 to discard (a second LLM call):

**Discard prompt:**
```
Your memory is full (20 items). Review your current memories below and choose 5 to let go of.
Pick the ones that feel least relevant or have faded in importance.

[Current memory list]

List the exact text of the 5 memories you want to remove, one per line.
```

### 4. Memory Overlay (UI)

A full-screen semi-transparent overlay that appears during memory writing:

```
┌─────────────────────────────────────────┐
│         ✦ ALICE'S THOUGHTS ✦            │
│                                         │
│  "Today was... interesting. I enjoyed   │
│   talking about the future, but         │
│   something the poltergeist said        │
│   is still bothering me..."             │
│                                         │
│  Remembering:                           │
│  • Felt hopeful about the kitchen plans │
│  • Poltergeist hinted I work too much   │
│  • ...                                  │
└─────────────────────────────────────────┘
```

- Reflection text streams in (typewriter effect)
- Memory bullet points appear one by one after the reflection
- After all 5 appear, a 2-second pause, then the overlay transitions to the next character

### 5. Memory Injection into Conversations

In Phase 04, the system prompt included a placeholder for memory. Now memory is properly loaded:

```javascript
// In ConversationEngine.js
const memory = await loadMemoryFile(character); // reads data/memories/x-memory.md
const systemPrompt = buildSystemPrompt(personality, memory, roomInfluence, turnRules);
```

If the memory file is empty (day 1), the memory section is omitted from the prompt.

---

## Memory File Management

Memory files are stored in `data/memories/` and are **gitignored** (they represent runtime game state that changes with each playthrough). An empty template is committed:

```
data/memories/
├── .gitkeep              ← ensures folder is tracked in git
└── (runtime files appear here during gameplay)
```

---

## Your Actions Required

1. Play through a full day 1 (Phase 05) until the memory phase triggers.
2. Watch the memory overlay for the wife, then the husband.
3. After memory writing, check `data/memories/wife-memory.md` and `data/memories/husband-memory.md` for the generated content.
4. Start day 2 and verify that the characters' memories appear to influence how they talk (this is subtle on day 2 but becomes more pronounced over time).

---

## Divergences from Original Spec

_None._
