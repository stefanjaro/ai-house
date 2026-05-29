---
name: align-the-codebase
description: Compare the current codebase against repository agent guidance and bring implementation, tests, scripts, dependencies, and docs back into alignment. Use when the user asks to align, audit, reconcile, clean up, or make the codebase match AGENTS.md, agent-reference docs, decision records, or stack decisions. Do not review user-docs unless the user explicitly mentions them.
---

# Align The Codebase

## Overview

Use current agent-facing guidance as the source of truth, inspect the codebase, then make focused changes so implementation and checks match the documented expectations. Avoid treating `user-docs/` as authoritative unless the user explicitly includes it.

## Workflow

1. Read guidance first.
   - Start with `AGENTS.md`.
   - Read relevant files in `agent-reference/`, especially `stack-decisions.md`, `security-guardrails.md`, and `dependency-policy.md`.
   - Read `decisions/` only when architecture, stack, or irreversible choices are involved.
   - Skip `user-docs/` unless the user explicitly mentions those docs.

2. Inspect the codebase.
   - Use `rg --files`, package manifests, configs, scripts, tests, and source layout to infer the actual stack and conventions.
   - Compare implementation against documented choices for security, data correctness, testing, maintainability, dependencies, and file organization.
   - Identify missing or stale tests, undocumented stack decisions, unused or unjustified dependencies, and places where code contradicts guidance.

3. Decide what should change.
   - Prefer aligning code to current guidance when guidance is clear.
   - Update `agent-reference/stack-decisions.md` when architectural or stack decisions become known or change.
   - Create an ADR only for major decisions that are expensive to reverse.
   - Ask before major architectural changes, large rewrites, or new major dependencies.

4. Plan non-trivial work.
   - State the mismatches and the intended correction path.
   - Keep the plan small, ordered, and tied to checks.
   - For bugs or behavior changes, add or update tests before or alongside implementation.

5. Implement in small steps.
   - Preserve backwards compatibility unless instructed otherwise.
   - Keep changes domain-oriented and avoid broad unsolicited rewrites.
   - Keep files and functions within the repo's size guidelines where practical.
   - Do not remove failing tests to get green checks.

6. Run relevant checks.
   - Run the smallest useful test, lint, typecheck, or build commands available.
   - If a check cannot run, state why and what risk remains.
   - Never claim checks passed unless they actually ran.

7. Summarize the alignment.
   - Report what was out of alignment, what changed, which checks ran, and remaining tradeoffs.
   - Mention any guidance that remains ambiguous or needs a user decision.

## Review Focus

Prioritize mismatches in this order:

1. Security and privacy rules.
2. Data correctness and authorization boundaries.
3. Tests and verifiability.
4. Stack and dependency decisions.
5. Maintainability and project organization.
6. Visual or UX guidance when frontend code is present.
