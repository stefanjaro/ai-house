# Agent Instructions

Keep this file concise, repo-specific, and current.

## Project Context

- Product: `AI House`, a browser-based narrative simulation game set in a modern apartment.
- Users: Primarily the repo owner during local development and playtesting.
- Business goal: Build a locally run playable MVP in phased increments with strong visual feedback and LLM-driven character conversations.
- Non-negotiables:
  - Follow TDD with Vitest. Write tests before or alongside implementation changes.
  - Verify completed feature work in the browser before calling it done.
  - Before browser verification, check whether the relevant local dev server is already running; only start the app if needed.
  - Keep secrets out of git.
  - Preserve the phased implementation-plan workflow and record divergences when scope changes.
  - Prefer SVG for lightweight UI-native visuals, but use generated bitmap art when the shipped product direction calls for portraits or richer scene illustration.
- Useful user docs: `user-docs/`

## Decision Hierarchy

When priorities conflict, choose in this order:

1. Security and privacy
2. Data correctness
3. Tests and verifiability
4. Maintainability
5. Delivery speed
6. Visual polish

## Required Workflow

1. Understand scope and constraints before editing.
2. Inspect existing patterns before introducing new ones.
3. Update `agent-reference/stack-decisions.md` when architectural or stack decisions become known or change.
4. Write or update a small plan for non-trivial work.
5. Add or adjust tests using TDD principles.
6. Implement in small, reviewable steps.
7. Run relevant checks, fix failures, and re-run checks until they pass or a real blocker remains.
8. Verify feature changes in the browser before marking work complete. First check whether the relevant local dev server is already running and reuse it when available; only start the app if needed. Use the configured browser MCP, and prefer Playwright for browser verification unless the task clearly needs another tool.
9. Summarize changes, checks run, verification performed, risks, and tradeoffs.

## Implementation Plan

- Living plan folder: `user-docs/implementation-plan/`
- Use the `generate-implementation-plan` skill when creating or materially updating phased MVP plans from idea docs.
- Keep the implementation-plan overview and phase files synchronized, including phase statuses: `NOT STARTED`, `IN PROGRESS`, or `COMPLETED`.
- Update the active phase file during development with progress notes, verification results, blockers, and user-requested divergences from the original plan.
- When the design changes from the original idea, add a `> **DIVERGENCE:**` block in the relevant phase file explaining what changed and why.
- Record material scope, sequencing, stack, or data model changes in the plan before or alongside implementation so future agents can reconcile codebase state with plan history.

## Engineering Rules

- Keep files generally under 400 lines.
- Keep functions generally under 50 lines.
- Avoid god objects.
- Avoid catch-all utility files.
- Prefer feature/domain-oriented organization.
- Store authored game prompt text in `src/prompts/` and import it into runtime modules instead of embedding prompt copy directly inside feature logic files.
- Prefer explicit code over clever abstractions.
- Refactor when complexity rises.
- Avoid broad unsolicited rewrites.
- Preserve backwards compatibility unless instructed otherwise.
- Explain tradeoffs before major architectural changes.
- Prefer incremental implementation over large rewrites.

## Testing Rules

- Follow TDD by default.
- Write tests before or alongside implementation.
- Follow the testing pyramid.
- Prefer many small tests.
- Use medium tests for feature-scoped behavior.
- Reserve large or browser tests for critical user journeys.
- Write tests for business logic.
- Add regression tests before fixing bugs.
- Never remove failing tests just to pass CI.
- Never claim tests passed unless actually run.
- Discover relevant checks from package scripts, project config, and existing docs.
- Run the smallest checks that prove the change first, then broader checks when risk warrants it.
- If checks fail, diagnose and fix the underlying issue before re-running them.
- Report any check that could not be run, including the reason and residual risk.

## Security Rules

- Never expose secrets to the client unless the product explicitly requires local user-managed keys.
- Treat all browser input as untrusted.
- Keep file-system access and secret-bearing operations on the server/local backend side when such boundaries exist.
- Do not commit real API keys, tokens, or local secret-bearing files.
- Use `agent-reference/security-guardrails.md` for auth, file handling, logging, or external integrations.
- Use `agent-reference/data-access.md` when adding or changing persistence, ownership, or memory/journal storage behavior.
- Use `agent-reference/threat-modeling.md` for security-sensitive or privacy-sensitive changes.

## Dependency Rules

- Ask or justify before adding major dependencies.
- Prefer official SDKs.
- Avoid abandoned packages.
- Remove unused dependencies when safely verified.

## ADR Rules

- Create ADRs only for major decisions that are expensive to reverse.
- ADRs explain why, not how.
- Keep ADRs concise.
- Do not create ADRs for routine implementation details.

## Documentation Budget

- `AGENTS.md` should ideally remain under 200 lines.
- `agent-reference/` docs should ideally remain under 150-250 lines each.
- ADRs should ideally fit within one screen.
- Prefer checklists, rules, and structure over long prose.
- Avoid tutorials, generic engineering essays, and repeated guidance.
- Explain intent, constraints, and non-obvious decisions.
- Do not explain basic concepts already widely understood by coding agents.

## Pointer Map

- `user-docs/idea/`: current idea and archived revisions.
- `user-docs/api/`: API references such as the OpenCode Zen request/response format.
- `user-docs/implementation-plan/`: phased implementation plan, status signpost, progress notes, and divergence log.
- `agent-reference/stack-decisions.md`: selected stack, runtime, and architecture choices.
- `agent-reference/security-guardrails.md`: practical security checklist for implementation and review.
- `agent-reference/data-access.md`: data ownership, authorization, and persistence guidance.
- `agent-reference/threat-modeling.md`: lightweight threat modeling guidance.
- `agent-reference/dependency-policy.md`: dependency hygiene and approval criteria.
- `agent-reference/skill-preferences.md`: user preferences for creating or updating agent skills.
- `decisions/`: minimal ADRs for major decisions that are expensive to reverse.
