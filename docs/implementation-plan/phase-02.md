# Phase 02 — Config & Content Files

**Status:** TODO
**Depends on:** Phase 01

## Goal
Set up all static content files the game needs before any logic runs: the character config template, personality files, and room influence files. By the end of this phase a user can copy the config template, fill it in with their API details, and the game engine will be able to read it.

## What Gets Built

### 1. `config.template.json`
A template users copy to `config.json` and fill in. Structure:

```json
{
  "husband": {
    "name": "Arthur",
    "model": "gpt-4o",
    "endpoint": "https://api.openai.com/v1",
    "apiKey": "your-api-key-here"
  },
  "wife": {
    "name": "Eleanor",
    "model": "gpt-4o",
    "endpoint": "https://api.openai.com/v1",
    "apiKey": "your-api-key-here"
  },
  "poltergeist": {
    "name": "Mischief",
    "model": "gpt-4o",
    "endpoint": "https://api.openai.com/v1",
    "apiKey": "your-api-key-here"
  }
}
```

Note: Names in `config.json` are the defaults shown on the character creation screen. The player can override them in-game.

### 2. Personality files in `data/personalities/`

**`husband-personality.md`** (starter template):
```
You are a medieval nobleman. You are thoughtful and measured in your speech, with a dry sense of humour. You care deeply for your wife but sometimes struggle to express it openly. You enjoy discussing history and philosophy. You speak in a slightly formal but warm register.
```

**`wife-personality.md`** (starter template):
```
You are a medieval noblewoman. You are sharp-witted, warm, and perceptive. You express your feelings more readily than your husband but you also enjoy sparring with ideas. You have a deep love for your home and family. You speak eloquently and with feeling.
```

**`poltergeist-personality.md`** (fixed, not editable in-game):
```
You are a mischievous underworld imp. Your sole purpose is to sow discord between the husband and wife. You are cunning, theatrical, and delighted by chaos. You never reveal your true intentions directly. You speak in a conspiratorial, gleeful tone, often as if sharing a secret. You are relentlessly focused on finding and exploiting cracks in the couple's relationship.
```

### 3. Room influence files in `data/room-influence/`

**`bedroom.md`**:
```
This conversation takes place in the bedroom — a private, intimate space. Conversations here should be reflective and personal. Characters may reminisce about the past, share quiet feelings, or revisit old memories. The tone is gentle and contemplative.
```

**`kitchen.md`**:
```
This conversation takes place in the kitchen — the heart of the home's daily life. Conversations here should be ambitious and forward-looking. Characters may discuss plans, aspirations, worries about the future, or practical matters of the household. The tone is energetic and purposeful.
```

**`living-room.md`**:
```
This conversation takes place in the living room — a comfortable, shared space for leisure. Conversations here can range freely across any topic of interest. Characters may discuss anything from idle observations to matters of the heart. The tone is relaxed and open.
```

**`mystery-room.md`**:
```
This is the poltergeist's private domain — a dark chamber in the underworld. No conversations between two characters take place here. This is where the poltergeist retreats to plan their next move. Monologues here should be theatrical and sinister, as if plotting aloud to an unseen audience.
```

### 4. Express endpoint: `GET /api/config`
Reads and returns `config.json` from the project root. Returns a 500 error with a descriptive message if `config.json` does not exist (reminding the user to copy `config.template.json`).

### 5. Express endpoint: `GET /api/content/:type/:filename`
Reads and returns any file from the `data/` directory. `:type` maps to a subfolder (`personalities`, `room-influence`, `memory`). `:filename` is the file name. Returns a 404 if the file doesn't exist.

### 6. Tests

`tests/services/configService.test.js`:
- Test that `GET /api/config` returns valid JSON when `config.json` exists
- Test that `GET /api/config` returns 500 when `config.json` is missing

`tests/services/contentService.test.js`:
- Test that `GET /api/content/room-influence/bedroom.md` returns the bedroom content
- Test that a missing file returns 404

> **TDD order:** Write all tests first. Run them — they fail. Add the Express endpoints to `server.js`. Run tests again — they should pass.

## User Testing Instructions
After this phase:
1. Copy `config.template.json` to `config.json` and fill in at least dummy values
2. Run `npm run server`
3. Visit `http://localhost:3001/api/config` in your browser — you should see your config JSON
4. Visit `http://localhost:3001/api/content/room-influence/bedroom.md` — you should see the bedroom text
5. Run `npm test` — all tests should pass

## Acceptance Criteria
- [ ] `config.template.json` exists with the correct structure
- [ ] All 3 personality files and 4 room influence files exist with sensible starter content
- [ ] Config and content API endpoints work and return correct data
- [ ] `npm test` passes

## Divergences
_None yet._
