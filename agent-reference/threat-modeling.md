# Threat Modeling Guidance

Use this for filesystem access, config handling, external LLM calls, personal data, hidden game state, or browser-to-server trust boundaries.

## Scope

- Identify the feature being changed.
- List sensitive assets: API keys, local config, journal contents, hidden character state, provider payloads, and saved conversation logs.
- Identify trust boundaries: browser/server, server/filesystem, and app/provider.
- Name the actors: local player, developer, external LLM provider, and a malicious local input path or crafted prompt.

## Threats To Check

- Path traversal or unauthorized file access.
- Secret leakage to the browser, logs, or committed files.
- Provider response fields leaking hidden reasoning or hidden agenda content to the player unintentionally.
- Corrupted or contradictory journal state caused by malformed writes or partial updates.
- Prompt injection via persisted memories, personalities, or room-influence files.

## Controls

- Constrain file operations to approved directories.
- Validate and normalize untrusted input at boundaries.
- Keep hidden system-only state separated from player-visible state.
- Redact secrets and avoid over-logging sensitive prompt material.
- Add regression tests for file-path validation and persistence edge cases.
