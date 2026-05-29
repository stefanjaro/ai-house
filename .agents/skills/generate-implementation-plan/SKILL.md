---
name: generate-implementation-plan
description: Create and maintain phased MVP implementation plans from a detailed idea document or PRD. Use when Codex needs to turn product requirements into iterative implementation phases, create a user-docs/implementation-plan folder with an index and phase files, track phase statuses, record progress, log divergences, and identify builder handoffs such as credentials, cloud setup, or external account actions during development.
---

# Implementation Plan

Use this skill to convert a product idea document or PRD into a living, phased implementation plan that supports iterative MVP development.

## Inputs

- A detailed idea document, PRD, or equivalent source in `user-docs/`.
- Existing agent guidance, especially `AGENTS.md` and `agent-reference/stack-decisions.md`.
- Current codebase state, if implementation has already started.

If the source document is unclear, ask only the minimum questions needed to phase the work safely.

## Required Files

Create and maintain:

- `user-docs/implementation-plan/index.md`
- `user-docs/implementation-plan/phase-01-<slug>.md`
- One additional phase file per phase.

Use two-digit phase numbers so files sort naturally.

## Status Values

Use only these phase statuses:

- `NOT STARTED`
- `IN PROGRESS`
- `COMPLETED`

Keep the status in `index.md` and in each phase file synchronized.

## Workflow

1. Read the PRD or idea document fully.
2. Read `AGENTS.md` and relevant `agent-reference/` files for stack, security, testing, and documentation constraints.
3. Inspect the codebase enough to understand whether the plan is starting fresh or continuing existing work.
4. Create `user-docs/implementation-plan/` if it does not exist.
5. Draft phases that produce verifiable increments rather than a big-bang implementation.
6. Identify builder handoffs: actions the user must do outside the repo, such as creating cloud projects, retrieving API credentials, configuring billing, approving provider choices, setting production secrets, domain setup, app store setup, or granting access.
7. Put the signpost, status table, sequencing notes, builder handoffs, and divergence log in `index.md`.
8. Create one markdown file per phase with scope, acceptance criteria, implementation tasks, builder inputs needed, tests/checks, progress notes, and divergences.
9. Update `AGENTS.md` with the implementation plan folder location and the rule that agents must keep statuses, progress notes, builder handoffs, and divergences current.
10. Before implementation work in any phase, mark that phase `IN PROGRESS`.
11. During implementation, update the active phase file whenever material progress, blockers, builder handoff state, verification results, or user-directed divergences occur.
12. When a phase is verified and accepted, mark it `COMPLETED` in both the phase file and `index.md`, then identify the next phase.

## Index File Shape

Use this structure for `index.md`:

```markdown
# Implementation Plan

Source documents:

- `user-docs/<source>.md`

## Current Status

- Current phase: Phase NN - <Name>
- Overall status: <short summary>
- Last updated: YYYY-MM-DD

## Phase Signpost

| Phase | Status | Purpose | Phase file |
| --- | --- | --- | --- |
| 01 | NOT STARTED | <purpose> | `phase-01-<slug>.md` |

## Builder Handoffs

| Phase | Status | Needed From Builder | Unblocks |
| --- | --- | --- | --- |
| 01 | NOT NEEDED | None yet. | N/A |

## Divergence Log

| Date | Phase | Decision | Reason | Impact |
| --- | --- | --- | --- | --- |

## Agent Notes

- Keep this index synchronized with every phase file.
- Keep Builder Handoffs current so blockers are obvious before implementation stalls.
- Record user-requested plan changes in the Divergence Log before or alongside implementation.
```

## Phase File Shape

Use this structure for each phase file:

```markdown
# Phase NN: <Name>

Status: NOT STARTED

## Purpose

<What this phase proves or unlocks.>

## Scope

- <Included work>

## Out Of Scope

- <Deferred work>

## Acceptance Criteria

- <User-verifiable outcome>

## Implementation Tasks

- [ ] <Task>

## Builder Inputs Needed

- None.

## Tests And Checks

- <Relevant checks to run>

## Progress Notes

- YYYY-MM-DD: <What changed, what was verified, or what remains blocked.>

## Divergences

- YYYY-MM-DD: <User-requested or implementation-driven divergence, reason, and impact.>
```

## Phasing Guidance

- Prefer phases that the user can see, try, or verify.
- Keep each phase small enough to finish and check independently.
- Put foundation work early only when it directly enables visible MVP behavior.
- Make data, auth, privacy, and deletion behavior explicit in the relevant phase.
- List builder handoffs in the earliest phase where they become useful, before they block implementation.
- Include tests/checks per phase; do not claim checks passed unless they were actually run.
- Treat the plan as living documentation, not a promise to preserve stale decisions.

## Builder Handoff Rules

Builder handoffs are tasks the agent cannot complete alone from the repo. Examples:

- Creating external projects or accounts.
- Retrieving API keys, OAuth credentials, or webhook secrets.
- Setting provider billing, quotas, domains, callback URLs, or production secrets.
- Choosing between paid providers when the tradeoff depends on user preference or budget.
- Granting repository, cloud, analytics, database, or deployment access.

For each handoff, record:

- What the builder must do.
- When it is needed.
- What implementation work it unblocks.
- Whether development can continue with a mock, local fallback, or placeholder.

## Divergence Rules

Record a divergence when:

- The user changes product direction.
- Implementation reveals that the original plan is impractical.
- The stack, data model, scope, or sequencing changes materially.
- A phase is split, merged, skipped, or redefined.

Each divergence must include the date, phase, decision, reason, and impact on future work.
