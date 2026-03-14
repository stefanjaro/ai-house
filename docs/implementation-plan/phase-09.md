# Phase 09 — End Game Sequence

**Status:** `[ ] TODO`
**Depends on:** Phase 08 complete and tested
**Goal:** After 10 days, all characters meet in the living room for a final confrontation. The poltergeist delivers a verdict. The player can then return to the start screen.

---

## What You'll Be Able to Test

After this phase you will see:
- After day 10's sleep sequence, a special "Day 11" banner appears: "The Final Day"
- All three characters walk to the living room
- The husband expresses his genuine feelings about the wife (LLM call, displayed on screen)
- The wife expresses her genuine feelings about the husband (LLM call, displayed on screen)
- The poltergeist, shown lurking in the corner of the room, delivers their verdict on whether the plan succeeded
- All three speeches are logged to `data/logs/end-of-game-conversations/`
- A final screen appears with a "Play Again" button that returns to the character creation screen

---

## What Gets Built

### 1. EndGameScene (`src/scenes/EndGameScene.js`)

A separate Phaser scene that loads after `SleepManager` detects `day === 11`. The game world scene remains visible but control passes to EndGameScene.

### 2. Character Positioning

All three characters walk to fixed positions in the living room:
- Husband: left side of the room, facing right
- Wife: right side of the room, facing left (facing each other)
- Poltergeist: back of the room, partially hidden behind the couch — visible but uninvited

A slow camera pan across the living room plays as characters take their positions, before the first speech begins.

### 3. Husband's Final Speech — LLM Call

**System prompt:**
```
[Husband's personality]
[Husband's full memory — all items]
```

**User message:**
```
The game is over. Ten days have passed. You are standing in the living room
with your partner. It's time to be completely honest.

Express your true feelings about [wife's name] — what you appreciate, what has troubled you,
how you feel about your relationship right now. Speak directly to her.

Keep your speech to 100 words or fewer. Speak from the heart.
This is a monologue, not a conversation.
```

### 4. Wife's Final Speech — LLM Call

Same structure as the husband's speech but directed at the husband. Called immediately after the husband's speech finishes displaying.

### 5. Poltergeist's Verdict — LLM Call

**System prompt:**
```
[Poltergeist's personality]
[Poltergeist's full memory — all items]
```

**User message:**
```
You've been listening to their final confessions. The game is over.

Deliver your verdict: did your diabolical plan succeed? Did you tear them apart,
or did their bond prove stronger than your scheming?

Be dramatic. Be honest about what worked and what didn't. Gloat if you succeeded.
Begrudgingly acknowledge defeat if you failed.

Keep your verdict to 80 words or fewer. Address the player directly ("You've just witnessed...").
```

### 6. End Game Display (UI)

Each speech is shown in a full-width dialogue panel at the bottom of the screen (like subtitles, but larger), with the character's name above it. Typewriter effect per speech.

After all three speeches:
- A brief silence (3 seconds)
- A fade to a simple end screen:

```
┌─────────────────────────────────────────┐
│                                         │
│          ✦ AI HOUSE ✦                   │
│                                         │
│   The poltergeist [succeeded / failed]. │
│                                         │
│         [ Play Again ]                  │
│                                         │
└─────────────────────────────────────────┘
```

The "succeeded/failed" line is determined by parsing the poltergeist's verdict for positive/negative sentiment — or simply based on whether the poltergeist said "succeeded" or "failed" in their response. A fallback reads: "The poltergeist has spoken."

### 7. Conversation Log

All three speeches written to a single log file:

**Filename:** `data/logs/end-of-game-conversations/end-game_YYYY-MM-DD.md`

**Format:**
```markdown
# End of Game — Day 11
**Date:** 2026-03-14T20:15:00Z

---

## Bob's Final Words

[speech text]

---

## Alice's Final Words

[speech text]

---

## The Poltergeist's Verdict

[verdict text]
```

### 8. Play Again Flow

Clicking "Play Again":
1. Clears all runtime state (game state, memory files, conversation logs are preserved for reading)
2. Returns to CharacterCreationScene
3. Character names reset to defaults; personalities reset to their last saved values (not wiped)

---

## Your Actions Required

1. Let the game run all 10 days (or temporarily reduce the day count to 3 for testing — I'll add a debug config option for this).
2. Watch the end game sequence in full.
3. Check `data/logs/end-of-game-conversations/` for the final log.
4. Try "Play Again" and verify the character creation screen reloads correctly.
5. Report back on:
   - Did the husband/wife speeches feel authentic to their accumulated memories?
   - Was the poltergeist's verdict satisfying?
   - Any pacing issues (speeches too fast/slow)?

---

## Debug Option

To test the end game without running 10 full days, a `debug` flag in the Vite config will allow setting the starting day to 10 so only one final day runs before the end game triggers. This is removed before "release".

---

## Divergences from Original Spec

_None._
