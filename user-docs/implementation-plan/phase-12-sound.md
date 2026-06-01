# Phase 12: Sound

Status: NOT STARTED

## Purpose

Add audio only after the game loop and visual presentation are already working well.

## Scope

- Add ambient music, room ambience, UI interaction sounds, and turn-reveal/loading cues as appropriate.
- Provide sensible audio defaults such as mute controls and volume balancing.
- Ensure sound enhances pacing rather than becoming repetitive or distracting.

## Out Of Scope

- New gameplay systems.
- Deployment platform-specific packaging unless needed for basic web playback.

## Acceptance Criteria

- The game includes a coherent baseline audio layer that matches the established experience.
- The player can mute or reduce sound easily.
- Audio works in the browser without breaking existing gameplay flows.

## Implementation Tasks

- [ ] Decide the audio asset strategy and licensing approach.
- [ ] Add tests for audio state handling where practical.
- [ ] Implement audio playback, mute controls, and cues that match the current scene transitions, card selection, conversation reveal, and loading states.
- [ ] Browser-verify that sound works across the main gameplay and ending flows.

## Builder Inputs Needed

- Provide or approve final audio assets and their licensing approach if the assets are not generated in-repo.

## Tests And Checks

- Targeted `vitest` tests for audio state toggles where practical.
- Browser verification of sound playback and mute controls.

## Progress Notes

- 2026-05-29: Phase file created from `idea-v6.md`. No implementation work has started.

## Divergences

- 2026-06-01: Phase 12 should now key its cues to the scene-based flow and progressive conversation reveal model shipped in Phase 02, rather than assuming a more static page flow or fully pre-generated transcript playback.
