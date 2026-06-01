import { describe, expect, it } from 'vitest';
import { getRoomEffect } from '../src/lib/roomEffects.js';

describe('room effects', () => {
  it('describes the sacrificial altar as a personality inversion room', () => {
    const effect = getRoomEffect('sacrificial-altar');

    expect(effect.label).toBe('Inversion Ritual');
    expect(effect.promptRules.join(' ')).toContain('behavioral opposite');
    expect(effect.promptRules.join(' ')).toContain('Preserve the recognizable core');
  });

  it('provides lighter framing for non-altar rooms', () => {
    expect(getRoomEffect('living-room').intensity).toBe('light');
    expect(getRoomEffect('guest-bedroom').label).toBe('Borrowed Space');
    expect(getRoomEffect('couple-bedroom').label).toBe('Private Gravity');
  });
});
