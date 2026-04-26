# Phase 11 - Audio and Atmosphere

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Add sound last, as requested in the v5 idea, after the core game is playable.

## Scope

- Add ambient apartment audio.
- Add footsteps synchronized loosely with movement.
- Add text scrawl sounds for speech bubbles.
- Add room-specific ambience, especially for the altar room.
- Add mute and volume controls.
- Respect browser autoplay restrictions.

## Tests First

Write tests before implementation for:

- Audio preference state.
- Mute/volume control behavior.
- Audio event dispatch from movement and text scrawl systems.
- Graceful no-audio fallback when playback is blocked.

## Implementation Notes

- Keep sound optional and non-blocking.
- Use small local assets or generated simple audio only if licensing is clear.
- Do not let repeated text sounds become harsh; throttle or soften them.

## Browser Verification

- Trigger movement, conversations, mute, and volume changes in Chrome.
- Confirm no console errors when audio is blocked before user interaction.
- Confirm sound does not play when muted.

## Acceptance Criteria

- Audio improves atmosphere without being required to play.
- Player controls are obvious and persistent for the current run.
- The game remains usable with sound off.

## Divergence Log

No divergences yet.

