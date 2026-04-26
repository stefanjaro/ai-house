# Phase 05 - Character Creation and Local Config

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Let the player name the three characters, edit their personalities, and provide the local API key required for LLM play.

## Scope

- Add editable names for all three characters.
- Add default personalities, each detailed but no longer than 250 words.
- Allow the player to rewrite personalities during setup only.
- Add API key entry in the UI and persist it to a local plain text or config file through the server.
- Allow personalities to be viewed during gameplay.
- Validate topic-independent setup requirements before starting Day 1.

## Tests First

Write tests before implementation for:

- Personality word-count validation.
- Required character names.
- Setup state serialization without leaking the API key into client logs.
- Server write/read behavior for local config.
- Gameplay personality lookup is read-only.

## Implementation Notes

- API key storage must be local and gitignored.
- Do not commit user-created personalities or API keys.
- If default personalities live in files, keep them concise and easy to edit.
- Preserve the v5 rule: personalities cannot change after game start.

## Browser Verification

- Fill out setup in the running app.
- Confirm invalid fields show clear UI states.
- Confirm setup can proceed when valid.
- Confirm personalities are viewable but not editable in the game screen.

## Acceptance Criteria

- Player setup works end to end locally.
- API key is persisted only in ignored local storage/file paths.
- Character personalities are available for later prompt assembly.

## Divergence Log

No divergences yet.

