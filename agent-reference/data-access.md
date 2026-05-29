# Data Access Guidance

Use this when adding or changing persistence, journals, conversations, personalities, imports, or exports.

## Currently Known Data Areas

- Character personalities
- Character journals
- Conversation content
- Room context that affects prompts

## Rules

- File ownership is local to the user running the game; there is no multi-user model today.
- Reads and writes should go through clear service boundaries, not ad hoc persistence from unrelated modules.
- Do not assume filenames, directories, or storage backends that are not explicitly decided in current project docs.
- Validate file targets against approved locations before any mutation once the storage design is chosen.
- Normalize persisted content when a stable format prevents prompt drift or contradictory state.
- Preserve audit-relevant timestamps or day references when changing saved conversation or journal behavior.

## Correctness Checks

- Define the persistence contract before implementing new save/update flows.
- Add tests for path handling and failure handling once file-backed persistence is specified.
- Add regression coverage before changing journal update semantics.
- Update `agent-reference/stack-decisions.md` if a new storage layer or architectural boundary is introduced.
