import { describe, expect, it } from 'vitest';
import { getRoomEffect } from '../src/lib/roomEffects.js';

describe('room effects', () => {
  it('describes the sacrificial altar as a personality inversion room', () => {
    const effect = getRoomEffect('sacrificial-altar');

    expect(effect.label).toBe('Backwards Brain Blast');
    expect(effect.promptRules.join(' ')).toContain("flips each character's main vibe on its head");
    expect(effect.promptRules.join(' ')).toContain('Keep the same person underneath');
  });

  it('provides lighter framing for non-altar rooms', () => {
    expect(getRoomEffect('living-room').intensity).toBe('light');
    expect(getRoomEffect('guest-bedroom').label).toBe('Weird Guest Energy');
    expect(getRoomEffect('couple-bedroom').label).toBe('Pajama Zone');
  });
});
