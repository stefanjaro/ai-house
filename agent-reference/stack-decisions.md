# Stack Decisions

Update this file when stack, runtime, hosting, backend, or architecture choices become known or change.

## Current Choices

- Frontend: Vite with vanilla JavaScript.
- Backend: Local Node.js 24 + Express API helper. The browser app talks to a server-side `/api/conversations` route so the OpenCode Zen key stays out of the client.
- Database: Not yet specified.
- Auth: None for app users. The product is local-only.
- Hosting: Deployment is intended, but the target platform is not yet chosen.
- Payments: None.
- Analytics: None currently planned.
- Email: None.
- LLM provider: OpenCode Zen using an OpenAI-compatible API shape.
- Primary model target: GPT-5.4-Nano, per the current idea doc.

## Architecture Notes

- Primary app shape: Browser-based narrative simulation game with a scene-based setup flow, explicit confirmation scene, and dedicated conversation stage.
- Phase 1 runtime split: Vite browser client on `5173`, local Express API on `3101`, proxied through Vite during development.
- Data ownership boundaries: Not yet fully specified by the current idea doc.
- Server/client split: Character selection, staged review, and transcript playback run in the browser; provider requests and API-key handling stay on the local server.
- Character customization: Edited names and personalities live in browser session state, and the selected customized character profiles are forwarded with each conversation request so server-side prompt assembly uses the current cast state.
- Conversation delivery: turns are generated progressively; the first turn can appear immediately, later turns continue in the background, and the player advances reveal manually.
- Background jobs: None currently planned.
- File storage: Not yet specified by the current idea doc.

## Constraints

- The user wants visuals developed and tested early.
- Prefer SVG for lightweight UI-native visuals, but the current product direction also uses generated bitmap room and portrait art where richer illustration is part of the experience.
- Feature completion requires browser verification, not just tests.
- Browser verification should prefer Playwright.
- The implementation plan is a first-class project artifact and must stay current.

## Change Rules

- Update this file before implementing a newly known stack choice.
- Keep entries short: decision, reason, relevant constraints.
- Link to ADRs for major decisions.
