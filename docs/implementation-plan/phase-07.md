# Phase 07 — Poltergeist Planning & Sleep/Reset

**Status:** `[ ] TODO`
**Depends on:** Phase 06 complete and tested
**Goal:** The poltergeist schemes in the mystery room (visible to the player), all characters sleep, and a new day begins automatically.

---

## What You'll Be Able to Test

After this phase you will see:
- After the husband and wife finish their memory writing (Phase 06), the poltergeist walks into the mystery room
- A monologue overlay shows the poltergeist's scheming thoughts — their diabolical plan based on the day's events
- The poltergeist also writes their memory (2 items)
- A "sleep" sequence plays: the screen dims, characters enter sleep positions, and a night transition effect plays
- A new day banner appears ("Day 2 of 10") and the cycle begins again from Phase 05 logic
- This loop continues until the end of day 10, at which point the game transitions to the end game (Phase 09)

---

## What Gets Built

### 1. DiabolicalPlanner (`src/game-loop/DiabolicalPlanner.js`)

Called by `DayManager` after the husband/wife memory writing phase. Handles two tasks:
1. The poltergeist's diabolical monologue
2. The poltergeist's memory writing

**Sequence:**
```
1. Poltergeist walks to mystery room (husband and wife cannot see this room)
2. Poltergeist monologue (LLM call — shown on screen)
3. Poltergeist memory writing (LLM call — shown on screen)
4. Hand off to SleepManager
```

### 2. Poltergeist Monologue — LLM Call

A single LLM call to the poltergeist's model:

**System prompt:**
```
[Poltergeist's personality]
[Poltergeist's current memory]
```

**User message:**
```
You're alone in your mystery room. Today's events:

[Transcript of the husband/wife conversation]
[Transcript of your conversation with [target name]]

Deliver a short diabolical monologue (3-5 sentences) addressed to yourself.
Reflect on how today went toward your goal of tearing the couple apart.
Mention what worked, what didn't, and what you plan to try next.
This is visible to the player watching the game — make it entertaining and sinister.
Keep it under 80 words.
```

### 3. Poltergeist Memory — LLM Call

Immediately after the monologue, the poltergeist reflects on their memory (same structure as Phase 06 but with 2 items instead of 5):

**Prompt difference:**
```
Choose the 2 most strategically useful things to remember from today.

Format:
REFLECTION: [inner monologue, 1-2 sentences]
MEMORIES:
- [memory 1]
- [memory 2]
```

Memory file: `data/memories/poltergeist-memory.md`
Max items: 10. Discard prompt triggers when at capacity (choose 2 to discard).

### 4. Monologue Overlay (UI)

Similar to the memory overlay but styled for the mystery room aesthetic — darker colours, ominous tone:

```
┌─────────────────────────────────────────┐
│       ✦ THE POLTERGEIST SCHEMES ✦       │
│                                         │
│  "Excellent. The wife is already         │
│   doubting whether he listens to her.   │
│   Tomorrow I'll press that further...   │
│   They won't even see it coming."       │
│                                         │
│  Planning to remember:                  │
│  • Wife doubts husband's attentiveness  │
│  • Kitchen conversation showed tension  │
└─────────────────────────────────────────┘
```

Monologue streams in (typewriter effect), then memory items appear. 2-second pause, then the overlay closes.

### 5. SleepManager (`src/game-loop/SleepManager.js`)

Handles the transition between days:

1. **Sleep animation:**
   - Characters walk to their sleep positions: husband and wife to the bedroom, poltergeist to the mystery room
   - A "Zzz" particle or sleep indicator appears above each character
   - Screen gradually dims to dark over 2 seconds
   - A soft "night" overlay plays (starfield or dark blue wash — simple Phaser graphic)

2. **State reset:**
   - Day counter increments: `gameState.day += 1`
   - `previousHusbandWifeRoom` updated to today's husband/wife room
   - Current day selections cleared

3. **New day trigger:**
   - If `day <= 10`: screen brightens, day banner shows, DayManager starts the new day
   - If `day === 11`: transitions to EndGameScene (Phase 09)

### 6. Full Day Loop Diagram (Complete)

```
[Day Banner]
     ↓
[Random Selections]
     ↓
[H+W walk to room A → Conversation (20 turns)]
     ↓
[Target spouse walks to room B → Poltergeist Conversation (10 turns)]
     ↓
[H+W walk to bedroom → Memory Writing (wife first, then husband)]
     ↓
[Poltergeist walks to mystery room → Monologue → Memory Writing]
     ↓
[Sleep sequence → Day increments]
     ↓
[If day ≤ 10: new Day Banner → loop]
[If day = 11: End Game Scene]
```

---

## Your Actions Required

1. Play through a full day including the poltergeist's monologue.
2. Check that the mystery room appears appropriately ominous when the poltergeist is in it.
3. Verify the sleep transition feels natural (not too fast, not too slow).
4. Confirm day 2 starts automatically and the previous room is excluded from day 2's room selection.
5. Let the game run for 2-3 full days and check that the characters' memories are accumulating correctly in `data/memories/`.

---

## Divergences from Original Spec

_None._
