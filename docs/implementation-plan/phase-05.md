# Phase 05 — Daily Game Loop — Conversations

**Status:** `[ ] TODO`
**Depends on:** Phase 04 complete and tested
**Goal:** The full daily cycle runs automatically — characters move to their assigned rooms and hold their conversations without any player input.

---

## What You'll Be Able to Test

After this phase you will see:
- The game begins a new day automatically after clicking "Start Game" (following character creation)
- A "Day X of 10" banner appears on screen as each day begins
- Random selections happen silently at the start of each day: rooms are picked, who starts the husband/wife conversation is picked, the poltergeist's target is picked
- The husband and wife walk to their assigned room and hold their conversation (displayed on screen via dialogue bubbles)
- Once they finish, the selected spouse walks to the room where the poltergeist is waiting; the poltergeist begins that conversation
- The day's activities indicator (a simple sidebar or top bar) shows which activity is currently happening
- At the end of day 1, the game pauses waiting for the memory/planning phase (built in Phase 06)

---

## What Gets Built

### 1. DayManager (`src/game-loop/DayManager.js`)

The central orchestrator for each day. Runs the following sequence:

```
1. Roll random selections
2. Display day banner ("Day X of 10")
3. Move husband & wife to their conversation room
4. Run husband/wife conversation (ConversationEngine)
5. Move poltergeist's target to the poltergeist's room
6. Run poltergeist conversation (ConversationEngine)
7. Hand off to MemoryManager (Phase 06)
```

All steps are `async/await` — each step waits for the previous to complete before starting.

### 2. RandomSelections (`src/game-loop/RandomSelections.js`)

Handles all randomness for the day:

**Room selection:**
- Available rooms: bedroom, living room, kitchen (mystery room always excluded)
- Excluded room: the room used for the husband/wife conversation the previous day (stored in game state)
- Pick 2 distinct rooms from the available pool: first for husband/wife, second for poltergeist's conversation
- On day 1, no exclusion applies

**Who starts the husband/wife conversation:**
- 50/50 random between husband and wife

**Poltergeist's target:**
- 50/50 random between husband and wife

All selections are stored in the game state for the current day and logged to the browser console for debugging.

### 3. Activity Indicator (UI)

A slim panel on the right side of the screen shows the day's schedule:

```
Day 3 of 10
─────────────
✓ H&W Conversation
▶ Poltergeist Conversation
○ Memory Writing
○ Planning
○ Sleep
```

Icons: `✓` = done, `▶` = in progress, `○` = pending. Updates in real time as the day progresses.

### 4. Day Banner

A full-width banner that slides in at the start of each day:
```
☽  Day 3 of 10  ☾
```
Stays on screen for 2 seconds, then slides out. Uses Phaser tweens for smooth animation.

### 5. Character Movement Integration

The `Character` class (from Phase 02) is updated with a `moveTo(room)` method that:
- Calculates the path to the room's designated standing spot
- Plays the walking animation while moving
- Resolves a Promise when the character arrives (so DayManager can `await` it)
- Respects access rules (poltergeist blocked from bedroom; husband/wife blocked from mystery room — though these rooms won't be targeted by DayManager anyway)

### 6. Game State (`src/game-loop/GameState.js`)

A singleton that tracks:
```javascript
{
  day: 1,                          // Current day (1–10)
  husbandName: "...",
  wifeName: "...",
  poltergeistName: "...",
  previousHusbandWifeRoom: null,   // Used for room exclusion logic
  currentDaySelections: {
    husbandWifeRoom: "bedroom",
    poltergeistRoom: "living_room",
    husbandWifeStarter: "husband",
    poltergeistTarget: "wife"
  }
}
```

---

## Day Flow Diagram

```
[Day Banner]
     ↓
[Random Selections]
     ↓
[H+W walk to room A]
     ↓
[H+W Conversation — 20 turns — dialogue shown on screen]
     ↓
[Selected spouse walks to room B (poltergeist is already there)]
     ↓
[Poltergeist Conversation — 10 turns — dialogue shown on screen]
     ↓
[Hand off to Phase 06 — Memory Writing]
```

---

## Your Actions Required

1. Start the game from the character creation screen.
2. Watch day 1 play out in full — two conversations happen sequentially.
3. Check:
   - Do characters walk to the right rooms?
   - Is the dialogue readable and paced well?
   - Does the activity indicator update correctly?
4. After both conversations, the game will pause (memory phase not yet built). This is expected.
5. Check `data/logs/` for conversation log files from day 1.

---

## Divergences from Original Spec

_None._
