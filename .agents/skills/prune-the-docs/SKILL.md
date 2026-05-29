---
name: prune-the-docs
description: Review repository agent guidance for repeated, redundant, stale, or overlapping content before any pruning. Use when the user asks to prune, deduplicate, compact, trim, or clean up AGENTS.md, agent-reference docs, decision records, or other agent-facing guidance. User docs are always out of scope, and the skill must report findings and receive explicit user confirmation before removing or rewriting content.
---

# Prune The Docs

## Overview

Find redundant agent-facing documentation, report the proposed removals or consolidations, and wait for explicit user confirmation before editing. Treat `user-docs/` as out of scope even if it appears related.

## Workflow

1. Establish scope.
   - Include `AGENTS.md`, `agent-reference/`, `decisions/`, and other agent-facing guidance the user explicitly names.
   - Exclude `user-docs/` completely.
   - Preserve the repo's documentation budget and pointer map conventions.

2. Inspect before judging.
   - Read the included docs directly.
   - Use `rg` to find duplicated phrases, repeated rules, overlapping pointer entries, and stale references.
   - Check whether `agent-reference/stack-decisions.md` or decision records contain repeated architectural guidance.

3. Report findings before editing.
   - List each proposed removal, consolidation, or rewrite with file paths and short reasons.
   - Separate true redundancy from intentional reinforcement.
   - Call out uncertainty and tradeoffs.
   - End by asking the user to explicitly confirm which proposed changes to apply.

4. Do not edit without explicit confirmation.
   - Stop after the report unless the user clearly confirms removal or rewrite.
   - Treat vague approval as insufficient when the affected content is broad or ambiguous.
   - Never prune `user-docs/`.

5. Apply only confirmed changes.
   - Keep edits small and reviewable.
   - Preserve source-of-truth intent, links, and repo-specific constraints.
   - Prefer removing repetition over rephrasing everything.
   - If a decision changes, update the appropriate decision or stack document rather than hiding it elsewhere.

6. Verify and summarize.
   - Re-read edited sections for accidental loss of meaning.
   - Run lightweight checks such as `rg` or line counts when useful.
   - Summarize applied changes, intentionally preserved repetition, and any remaining risks.

## Output Shape

Before confirmation, provide:

- `Findings`: concise list with file references.
- `Proposed changes`: exact content areas to remove, merge, or rewrite.
- `Not touching`: anything intentionally left alone, especially `user-docs/`.
- `Confirmation needed`: a direct request for explicit approval.

After confirmation and edits, provide a short change summary, verification run, and residual tradeoffs.
