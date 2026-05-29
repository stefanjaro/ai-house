# Stack Decisions

Update this file when stack, runtime, hosting, backend, or architecture choices become known or change.

## Current Choices

- Frontend: Vite with vanilla JavaScript.
- Backend: Not yet locked by the current idea doc. Earlier project docs referenced a local Node.js + Express helper, but that should be treated as historical context until re-confirmed.
- Database: Not yet specified.
- Auth: None for app users. The product is local-only.
- Hosting: Deployment is intended, but the target platform is not yet chosen.
- Payments: None.
- Analytics: None currently planned.
- Email: None.
- LLM provider: OpenCode Zen using an OpenAI-compatible API shape.
- Primary model target: GPT-5.4-Nano, per the current idea doc.

## Architecture Notes

- Primary app shape: Browser-based narrative simulation game with a trading-card-inspired presentation.
- Data ownership boundaries: Not yet fully specified by the current idea doc.
- Server/client split: The game runs in the browser, but broader backend and secret-management boundaries remain to be decided.
- Background jobs: None currently planned.
- File storage: Not yet specified by the current idea doc.

## Constraints

- The user wants visuals developed and tested early.
- Any custom visuals required for the game should be SVG files.
- Feature completion requires browser verification, not just tests.
- Browser verification should prefer Playwright.
- The implementation plan is a first-class project artifact and must stay current.

## Change Rules

- Update this file before implementing a newly known stack choice.
- Keep entries short: decision, reason, relevant constraints.
- Link to ADRs for major decisions.
