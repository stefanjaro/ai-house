# AI House — Setup Guide

## Prerequisites

- **Node.js LTS** (v20 or later). Download from [nodejs.org](https://nodejs.org).

## Installation

```bash
cd ai-house
npm install
```

## Running the Game

```bash
npm run dev
```

Open your browser at `http://localhost:5173`. You should see a dark grey canvas centred on a black page.

## Configuring API Keys

Each character (Husband, Wife, Poltergeist) is powered by an LLM. You need to provide API credentials:

1. Copy the template:
   ```bash
   cp config/api-config.template.json config/api-config.json
   ```
2. Open `config/api-config.json` and fill in your details for each character:
   - `apiKey` — your API key
   - `endpoint` — the API endpoint URL (e.g. `https://api.anthropic.com/v1/messages`)
   - `model` — the model ID (e.g. `claude-sonnet-4-6`)

`api-config.json` is gitignored and will never be committed.

## Running Tests

```bash
npm test
```

Tests live in `tests/` and mirror the `src/` structure. The project follows TDD — tests are written before the code they exercise.

## Conversation Logs

At runtime the game writes conversation logs to:

- `data/logs/husband-wife-conversations/` — dialogue between the couple
- `data/logs/poltergeist-conversations/` — poltergeist's internal reasoning
- `data/logs/end-of-game-conversations/` — end-of-day summaries

These files are gitignored. The directory structure is preserved in git via `.gitkeep` files.
