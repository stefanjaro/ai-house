# Phase 01 — Project Setup

**Status:** TODO
**Depends on:** Phase 00 (assets should exist before running the UI, but code setup can begin in parallel)

## Goal
Create the foundational project structure: Vite frontend, Express backend, Vitest testing, and the folder layout described in `overview.md`. By the end of this phase you should be able to start both servers and see a placeholder page.

## What Gets Built

### 1. `package.json`
Single package.json at the project root managing both frontend and backend dependencies.

Key dependencies:
- `vite` — frontend bundler / dev server
- `express` — local backend server for file I/O
- `vitest` — test runner
- `cors` — for Express to accept requests from Vite dev server

Scripts:
- `npm run dev` — starts Vite dev server
- `npm run server` — starts Express server
- `npm test` — runs Vitest

### 2. Project folder structure
Create all folders listed in `overview.md` (empty, with `.gitkeep` files where needed):
- `src/engine/`, `src/services/`, `src/ui/screens/`, `src/ui/components/`, `src/styles/`
- `tests/engine/`, `tests/services/`
- `data/husband-wife-conversations/`, `data/poltergeist-conversations/`, `data/end-of-game-conversations/`
- `data/memory/`, `data/personalities/`, `data/room-influence/`
- `public/assets/rooms/`, `public/assets/sprites/`, `public/assets/ui/`

### 3. `vite.config.js`
Configures Vite to proxy `/api/*` requests to the Express server (port 3001).

### 4. `server.js`
A minimal Express server on port 3001 with:
- A health-check endpoint: `GET /api/health` → `{ status: "ok" }`
- CORS enabled for the Vite dev server origin (port 5173)

### 5. `src/main.js` + `index.html`
A bare-bones entry point that renders a placeholder `<h1>AI House</h1>` to confirm Vite is working.

### 6. `.gitignore`
Must include: `node_modules/`, `config.json`, `data/husband-wife-conversations/`, `data/poltergeist-conversations/`, `data/end-of-game-conversations/`, `data/memory/*.md` (but NOT the template files)

### 7. First test: health check
Write a Vitest test in `tests/services/healthCheck.test.js` that calls `GET /api/health` and asserts the response is `{ status: "ok" }`.

> **TDD order:** Write the test first. Run it — it will fail (server doesn't exist yet). Then create `server.js`. Run the test again — it should pass.

## User Testing Instructions
After this phase:
1. Run `npm install`
2. In one terminal: `npm run server` — should print `Server running on port 3001`
3. In another terminal: `npm run dev` — should print a localhost URL
4. Open the URL in your browser — you should see `AI House` as a heading
5. Run `npm test` — all tests should pass (1 test: health check)

## Acceptance Criteria
- [ ] Both servers start without errors
- [ ] Browser shows the placeholder heading
- [ ] `npm test` passes

## Divergences
_None yet._
