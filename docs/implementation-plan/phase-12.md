# Phase 12 — Sound

**Status:** TODO
**Depends on:** Phase 11 (all gameplay complete)

## Goal
Add audio: background music per room, UI click sounds, and character speech sounds. This is deliberately the last phase.

## What Gets Built

### Audio assets needed (user generates/sources these)
| Asset | Type | Notes |
|-------|------|-------|
| `public/assets/audio/bedroom-ambient.mp3` | Background loop | Soft, melancholic medieval strings |
| `public/assets/audio/living-room-ambient.mp3` | Background loop | Warm, crackling fire + gentle lute |
| `public/assets/audio/kitchen-ambient.mp3` | Background loop | Busy, rhythmic, slightly upbeat medieval music |
| `public/assets/audio/mystery-room-ambient.mp3` | Background loop | Dark, eerie, low drones |
| `public/assets/audio/click.mp3` | One-shot | Soft parchment/quill click sound |
| `public/assets/audio/speech-husband.mp3` | Loop while streaming | Soft low humming or muffled voice |
| `public/assets/audio/speech-wife.mp3` | Loop while streaming | Soft mid-range humming or muffled voice |
| `public/assets/audio/speech-poltergeist.mp3` | Loop while streaming | Eerie, slightly distorted muffled voice |

**Where to source audio:** Free medieval music is available on [freesound.org](https://freesound.org) and [incompetech.com](https://incompetech.com). Search for "medieval ambient", "lute loop", etc. Ensure you use CC0 or CC-BY licensed sounds.

### `src/services/audioService.js`
```js
export const audioService = {
  playRoomAmbience(room),   // loops the correct track, fading out the previous
  stopAmbience(),
  playClick(),
  startSpeechSound(character),  // loops speech sound while text is streaming
  stopSpeechSound(),
}
```

### Wiring to existing code
- `playRoomAmbience` called when a room fades in (center screen)
- `playClick` called on every click-to-proceed
- `startSpeechSound` / `stopSpeechSound` called around each streamed turn

### No tests
Audio behavior is not unit-testable in a meaningful way. Verify by ear.

## User Testing Instructions
After this phase:
1. Run the game
2. Each room should have distinct background music that crossfades when you switch rooms
3. Clicking anywhere triggers a soft click sound
4. Speech sounds play while text is streaming and stop when it finishes

## Acceptance Criteria
- [ ] Background music plays per room
- [ ] No audio glitches or overlapping tracks
- [ ] Click sounds play on interaction
- [ ] Speech sounds sync with streaming text
- [ ] No console errors related to audio

## Divergences
_None yet._
