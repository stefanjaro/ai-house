# Phase 04 — File System Service

**Status:** DONE (2026-03-15)
**Depends on:** Phase 02 (content endpoints), Phase 03 (engine shapes)

## Goal
Build the Express endpoints and client-side service module needed to read and write all runtime files: conversation logs, memory files, and config. This gives the rest of the game a clean interface for persistence.

## What Gets Built

### Express endpoints (added to `server.js`)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/config` | Return parsed `config.json` _(already in Phase 02)_ |
| `GET` | `/api/memory/:character` | Read `data/memory/{character}-memory.md` |
| `PUT` | `/api/memory/:character` | Write (overwrite) `data/memory/{character}-memory.md` |
| `GET` | `/api/personality/:character` | Read `data/personalities/{character}-personality.md` |
| `PUT` | `/api/personality/:character` | Write `data/personalities/{character}-personality.md` (husband and wife only — poltergeist returns 403) |
| `POST` | `/api/conversations/couple` | Write a new conversation log to `data/husband-wife-conversations/`. Auto-generates a filename: `day-{N}-{timestamp}.md` |
| `POST` | `/api/conversations/poltergeist` | Write a new conversation log to `data/poltergeist-conversations/`. Same naming pattern. |
| `POST` | `/api/conversations/end-game` | Write the end-game conversation log to `data/end-of-game-conversations/`. |
| `GET` | `/api/conversations/:type` | List all log filenames for a given type (`couple`, `poltergeist`, `end-game`) |
| `GET` | `/api/room-influence/:room` | Read `data/room-influence/{room}.md` |

### Client-side: `src/services/fileService.js`
A module that wraps all the above endpoints. Every function returns a Promise.

```js
export const fileService = {
  getConfig(),
  getMemory(character),
  setMemory(character, content),
  getPersonality(character),
  setPersonality(character, content),
  saveConversationLog(type, day, content),
  listConversationLogs(type),
  getRoomInfluence(room),
}
```

### Tests

`tests/services/fileService.test.js`:
- `getConfig()` returns an object with husband/wife/poltergeist keys
- `getMemory("husband")` returns a string (even if empty)
- `setMemory("husband", content)` then `getMemory("husband")` returns the same content
- `setPersonality("poltergeist", content)` is rejected with 403
- `saveConversationLog("couple", 1, content)` creates a file in the correct folder
- `listConversationLogs("couple")` returns an array that includes the just-created file
- `getRoomInfluence("bedroom")` returns the bedroom influence text

> **TDD order:** Write tests first, run and watch them fail, implement endpoints + fileService, run again until all pass.

## User Testing Instructions
After this phase:
1. `npm run server` in one terminal, `npm test` in another
2. All tests pass
3. Manually test: run `npm run server`, then open `http://localhost:3001/api/memory/husband` — should return empty or starter content
4. Check that writing memory via a PUT request (use a tool like Insomnia or curl) creates/updates the file on disk

## Acceptance Criteria
- [ ] All listed endpoints exist and respond correctly
- [ ] `fileService.js` covers all endpoints
- [ ] `npm test` passes

## Divergences
_None yet._
