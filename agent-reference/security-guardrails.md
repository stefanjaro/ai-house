# Security Guardrails

Use this checklist when implementing file access, config handling, logging, or external integrations.

## Secrets

- Keep real API keys and tokens out of git.
- Never hardcode real credentials into frontend code, fixtures, screenshots, or docs.

## Local App Boundaries

- Treat browser input as untrusted.
- Keep filesystem mutations behind explicit backend routes or server-side code when local file access is introduced.
- Validate filenames and paths before reading or writing local files.
- Deny path traversal by resolving against approved base directories.

## LLM Integration

- Prefer server-side secret handling where feasible.
- Keep provider credentials in approved secret-bearing local or deployed configuration only.
- Stream only the intended assistant-visible content to the UI.
- Do not expose hidden reasoning fields in the user-facing transcript.

## Errors And Logging

- Return safe error messages to the UI.
- Do not leak stack traces, provider payloads, or secrets.
- Avoid logging full prompts, journals, or personalities unless the task requires it and the user accepts the privacy tradeoff.

## Dependencies

- Prefer official SDKs or well-understood HTTP integrations.
- Scrutinize packages that touch file handling, parsing, browser automation, or server execution.
