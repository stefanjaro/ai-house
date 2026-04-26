# Phase 00 - Project Foundation

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Create the smallest reliable local development base for AI House. This phase should make future phases easy to run, test, and verify without adding game behavior yet.

## Scope

- Initialize or normalize the Vite + vanilla JavaScript frontend.
- Add the local Express server needed for filesystem access.
- Configure Vitest for pure unit tests and jsdom UI tests.
- Add npm scripts for development, tests, and any combined local run workflow.
- Create gitignored local config and runtime data scaffolding.
- Add placeholder app screens only when needed to verify the toolchain.

## Tests First

Write tests before implementation for:

- Test runner sanity: a minimal pure module test proves Vitest is wired.
- Server health/config behavior: local endpoint returns expected shape without exposing secrets.
- Static app mount: the frontend can render a known root element in jsdom.

## Implementation Notes

- `config.template.json` should document the expected OpenCode Zen fields without containing real credentials.
- `config.json` must be gitignored.
- Runtime `data/` content should be gitignored except for template or `.gitkeep` files when needed.
- Avoid game-specific systems in this phase; the goal is a trustworthy workbench.

## Browser Verification

- Start the local app.
- Navigate to it using Chrome DevTools MCP.
- Confirm the page loads without console errors and shows the baseline shell.

## Acceptance Criteria

- `npm test` passes.
- The local server and Vite app can run together or with clearly documented commands.
- No API key or generated runtime data is tracked.
- Phase status and completion date are updated when complete.

## Divergence Log

No divergences yet.

