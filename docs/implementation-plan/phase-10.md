# Phase 10 — History Panel

**Status:** TODO
**Depends on:** Phase 09 (center screen, full game loop)

## Goal
Build the right-side history panel — a collapsible accordion where players can review what happened on any previous day without disrupting the current day's activity.

## What Gets Built

### History panel component (`src/ui/components/historyPanel.js`)

**Structure:**
- One accordion section per completed day, labelled "Day 1", "Day 2", etc.
- All sections start collapsed; clicking a day header expands it
- Only days that have fully completed appear in the panel

**Each expanded day contains (in order):**
1. **Random Selections** — styled distinctly (e.g., italicized, muted color). Shows: which rooms were chosen, which character the poltergeist targeted, who started the couple's conversation.
2. **Couple Conversation** — styled as a conversation transcript (speaker name + message, alternating alignment). Pulled from the conversation log file for that day.
3. **Poltergeist Conversation** — same styling as couple conversation but with a distinct color to indicate the poltergeist.
4. **Memory Reflections** — styled as a thought journal (each character's new memories listed under their name).
5. **Diabolical Plan** — the poltergeist's monologue, styled in a dark/sinister color.

### How history is stored and loaded
- After each activity completes, the game writes a structured day summary object to a session-level in-memory store (not a file — the history panel only needs to work during the current session)
- The history panel reads from this in-memory store and re-renders whenever a new day's data is added
- Conversation transcripts are loaded from the log files via `fileService.listConversationLogs` and `fileService.getConversationLog` if needed

### Tests

`tests/ui/historyPanel.test.js`:
- Panel shows only completed days
- Accordion sections expand and collapse on click
- Correct content appears in each section type
- Adding a new day's data to the store causes the panel to re-render with the new day

> **TDD order:** Tests first, then implementation.

## User Testing Instructions
After this phase:
1. Run a game through at least 2 complete days
2. Check the right panel — should show "Day 1" collapsed
3. Click "Day 1" — it expands to show all activities
4. Click again — it collapses
5. Both Day 1 and Day 2 should appear after day 2 completes
6. Scrolling within the panel should work independently of the center screen

## Acceptance Criteria
- [ ] Accordion shows correct day-by-day history
- [ ] All activity types are styled distinctly
- [ ] Expand/collapse works
- [ ] Panel is independent of center screen scroll
- [ ] `npm test` passes

## Divergences
_None yet._
