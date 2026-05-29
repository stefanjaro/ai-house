---
name: generate-technical-plan
description: Generate senior-engineer technical implementation plans from existing phase markdown documents. Use when Codex needs to convert a user-docs implementation phase into an execution brief for a capable coding model, grounded in the current codebase, tests, AGENTS.md, and relevant agent-reference guidance.
---

# Technical Implementation Plan

Use this skill to convert an existing phase document into a technical execution plan. The phase document is product/project memory: purpose, scope, acceptance criteria, implementation tasks, progress notes, and divergences. The technical plan is an execution brief: how to implement the phase safely in this codebase.

Do not execute the phase while generating the plan.

## Inputs

- Required: path to the phase markdown file, such as `user-docs/implementation-plan/phase-04.md`.
- Optional: output path for the technical plan.
- Optional: instruction to refresh an existing technical plan.

Default output path:

- `user-docs/implementation-plan/technical-plans/<source-phase-filename>`

Create `technical-plans/` if needed.

## Required Pre-Read

Before writing the technical plan, read:

1. The supplied phase document.
2. `AGENTS.md` or the repo's equivalent agent instruction file.
3. Relevant docs linked from `AGENTS.md`, especially:
   - `agent-reference/stack-decisions.md`
   - `agent-reference/security-guardrails.md` when auth, data access, payments, webhooks, files, logging, or external integrations are involved.
   - `agent-reference/data-access.md` when persistence, ownership, permissions, imports, exports, or multi-user behavior are involved.
   - `agent-reference/threat-modeling.md` when the phase is security-sensitive or privacy-sensitive.
   - `agent-reference/dependency-policy.md` when dependencies may be added, updated, or removed.
4. Existing technical plans, if any, for style and consistency.
5. Relevant existing code files, tests, routes, components, hooks, services, utilities, configs, package scripts, and CI files.

Inspect the current codebase before writing. The plan must cite actual files and reflect existing architecture, patterns, naming, and test conventions. Do not assume paths from the phase document alone.

## Workflow

1. Resolve the phase path and output path.
2. If the output file already exists:
   - Read it fully.
   - Preserve useful prior content when it is still accurate.
   - Refresh stale sections clearly when the phase or codebase has changed.
   - Do not overwrite it blindly.
3. Read the required docs and inspect the codebase with fast search tools such as `rg --files` and `rg`.
4. Identify the concrete implementation surface: files to create, files to modify, tests to add or update, commands to run, and manual checks.
5. Write the technical plan using the exact structure below.
6. Keep the plan specific enough to guide implementation, but do not generate full implementation code.

## Output Structure

```markdown
# Technical Plan: Phase XX - Phase Name

## Source Phase Document

Link or path to the source phase doc.

## Implementation Intent

Explain the engineering approach. Do not merely restate the product goal.

## Current Codebase Context

List the existing files, components, hooks, services, routes, tests, utilities, and conventions the implementer should inspect first.

## Relevant Engineering Principles

Summarize the specific principles from `AGENTS.md` and reference docs that matter for this phase. Include testing, architecture, maintainability, accessibility, security, and code quality principles where relevant.

## Files To Create

List expected new files. For each file include:

- Purpose
- Key exports or responsibilities
- Notes or constraints

## Files To Modify

List expected existing files to update. For each file include:

- Required changes
- Constraints
- Things not to change

## Data, State, And API Model

Describe relevant types, interfaces, props, browser APIs, local state, persistence, API contracts, route changes, local storage keys, or domain models.

## Implementation Steps

Provide ordered implementation steps. These should be specific enough to guide execution, but must not generate the full code.

Write this like a senior engineer directing a capable junior engineer.

## Tests To Add Or Update

Specify test coverage by type and likely file path:

- Unit tests
- Component tests
- Integration tests
- Browser/manual checks

The test plan must follow the testing principles in the repository's agent docs.

## Edge Cases And Failure States

List the important edge cases, empty states, permission failures, loading states, race conditions, mobile concerns, accessibility concerns, and error handling requirements.

## Risk Areas

Call out implementation areas where the coding model must be careful.

## Verification Before Completion

List the required commands and checks that must pass before the phase can be marked complete.

Include at minimum, unless the repo uses different commands:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Also include manual verification checks relevant to the phase.

## Stop Conditions

Define when the implementing agent must stop rather than continuing to iterate.

The default should be:

- Complete one implementation pass
- Complete one focused test/fix pass
- Stop and summarize remaining issues instead of repeatedly iterating
- Do not mark the phase complete unless verification has passed or failures are explicitly documented

## Phase Document Update Requirements

After implementation, the implementing agent must update the source phase document:

- Add progress notes
- Record divergences from the plan
- Update implementation task checkboxes
- Update status only when completion criteria are actually met
```

## Planning Constraints

- Do not generate the full implementation code inside the technical plan.
- Do not repeat the phase document.
- Do not create vague generic advice.
- Do not ignore `AGENTS.md` or the repo's reference docs.
- Do not assume file paths without inspecting the codebase.
- Do not expand scope beyond the phase document.
- Do not mark the phase complete just because code was written.
- Do not overwrite an existing technical plan without first preserving useful prior content or clearly refreshing it.
- Do not add major dependencies to the plan without justification from `agent-reference/dependency-policy.md`.
- If the phase requires architectural or stack decisions that are unknown, call out the required `agent-reference/stack-decisions.md` update before implementation.

## Quality Bar

The finished plan should let a capable implementation model work with minimal guesswork. It should name concrete files, tests, commands, and risks, while leaving implementation details for the coding pass.

Prefer concise, directive writing. Include only principles and context that materially affect this phase.

## Example Invocation

"Use the generate technical plan skill to generate a technical plan from `docs/phases/phase-04-recording-and-timer.md` and write it to `docs/technical-plans/phase-04-recording-and-timer-plan.md`."
