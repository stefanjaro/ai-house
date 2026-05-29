# Dependency Policy

Dependencies are long-term maintenance commitments. Add them only when they reduce real complexity or provide trusted integration coverage.

## Add Criteria

Before adding a dependency, confirm:

- It solves a current problem, not a speculative one.
- The package is actively maintained.
- The license is acceptable for the project.
- The runtime and bundle cost are reasonable.
- The project does not already have an equivalent dependency.

## Preferences

- Prefer official SDKs for platform integrations.
- Prefer small, focused packages over broad abstractions.
- Prefer browser-native and Node-native capabilities when they are sufficient.
- Avoid framework churn unless the user explicitly wants a stack change.

## Ask Or Justify First

- Rendering or game engines
- State-management libraries
- LLM SDKs beyond simple HTTP unless they materially reduce risk
- Rich animation libraries
- Filesystem abstraction layers
- Test frameworks beyond the chosen Vitest stack

## Updates And Removal

- Run relevant tests after updates.
- Remove unused dependencies when safely verified.
- Remove related config, imports, tests, and docs when removing a package.
