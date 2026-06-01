import { describe, expect, it } from 'vitest';
import {
  MAX_PERSONALITY_WORDS,
  createCharacterProfiles,
  validateCharacterProfile,
} from '../src/lib/characterProfiles.js';

describe('character profile validation', () => {
  it('creates editable profiles from the base cast', () => {
    const profiles = createCharacterProfiles();

    expect(profiles.husband.name).toBe('Elias');
    expect(profiles.wife.role).toBe('Wife');
    expect(profiles.friend.personality).toContain('charismatic');
  });

  it('accepts a 250-word personality', () => {
    const personality = Array.from({ length: MAX_PERSONALITY_WORDS }, (_, index) => `word${index + 1}`).join(' ');
    const result = validateCharacterProfile({
      name: 'Elias',
      personality,
    });

    expect(result).toMatchObject({
      ok: true,
      personalityWordCount: 250,
    });
  });

  it('rejects a personality above the 250-word limit', () => {
    const personality = Array.from({ length: MAX_PERSONALITY_WORDS + 1 }, (_, index) => `word${index + 1}`).join(' ');
    const result = validateCharacterProfile({
      name: 'Elias',
      personality,
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain('250 words or fewer');
  });
});
