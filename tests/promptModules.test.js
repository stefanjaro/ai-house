import { describe, expect, it } from 'vitest';
import { getRoomById } from '../src/lib/gameData.js';
import { getRoomEffect } from '../src/lib/roomEffects.js';
import { ROOM_EFFECT_PROMPT_RULES, ROOM_PROMPT_NOTES } from '../src/prompts/roomPrompts.js';

describe('prompt modules', () => {
  it('provides room prompt notes through centralized prompt modules', () => {
    expect(getRoomById('guest-bedroom').promptNote).toBe(ROOM_PROMPT_NOTES['guest-bedroom']);
    expect(getRoomById('sacrificial-altar').promptNote).toBe(ROOM_PROMPT_NOTES['sacrificial-altar']);
  });

  it('provides room effect prompt rules through centralized prompt modules', () => {
    expect(getRoomEffect('living-room').promptRules).toBe(ROOM_EFFECT_PROMPT_RULES['living-room']);
    expect(getRoomEffect('sacrificial-altar').promptRules).toBe(
      ROOM_EFFECT_PROMPT_RULES['sacrificial-altar'],
    );
  });
});
