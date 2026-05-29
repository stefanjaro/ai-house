# Decision Records

Use minimal ADRs for major decisions that are expensive to reverse.

ADRs explain why a decision was made. They do not replace implementation docs, tickets, or code comments.

## When To Create One

- Stack or hosting choice changes
- Major architecture boundary
- Persistence model change
- LLM/provider strategy that is expensive to reverse
- Security-sensitive tradeoff

## Rules

- Keep each ADR short enough to scan in one screen.
- Use `000-template.md`.
- Prefer numbered filenames such as `001-short-title.md`.
- Mark superseded decisions instead of rewriting history.
