# AGENTS.md - AI House Project

## Source Of Truth

- Game design: `docs/idea/idea-v5.md`
- API reference: `docs/api/opencode-zen.md`
- Implementation memory: `docs/implementation-plan/overview.md` and the matching phase files

Read the relevant source file instead of duplicating its contents here.

## How To Work

- Follow the current phase in `docs/implementation-plan/`.
- Keep the plan files current whenever a phase starts, finishes, changes scope, or diverges from the v5 idea.
- When the live design changes, add a dated `> **DIVERGENCE:**` block to the relevant phase file explaining what changed and why.
- Build visual foundations before deeper game logic, matching the v5 preference for SVG visuals first.

## Engineering Rules

- Use Vite + vanilla JavaScript for the frontend and Node.js + Express for local filesystem endpoints.
- Use Vitest for all automated tests.
- Follow TDD: write or update tests before implementation code, then run the tests and make them pass.
- Keep pure game rules in engine modules, browser interaction in UI modules, and filesystem/LLM side effects behind services.
- Store local API keys and generated runtime data only in gitignored files.

## Verification

- Before marking any phase or task complete, run the relevant tests.
- Also verify the feature in the running browser app with Chrome DevTools MCP; tests alone are not enough.
- For UI work, check for console errors, obvious layout overlap, and at least one narrow viewport.

## Current Design Assumptions

- The player runs the game locally in a browser; there is no deployment target.
- Characters use OpenCode Zen with GPT-5.4-Nano.
- Player-provided API keys are entered through the UI and saved locally in ignored files.
- Generated assets should be SVG unless a later documented divergence says otherwise.

