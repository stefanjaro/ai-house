import { characters, getCharacterById } from './gameData.js';
import { countWords } from './topic.js';

export const MAX_PERSONALITY_WORDS = 250;

export function createCharacterProfiles(sourceCharacters = characters) {
  return Object.fromEntries(sourceCharacters.map((character) => [character.id, { ...character }]));
}

export function getCharacterProfile(characterProfiles, characterId) {
  return characterProfiles?.[characterId] ?? getCharacterById(characterId);
}

export function getSelectedCharacterProfiles(characterProfiles, selectedCharacterIds) {
  return selectedCharacterIds
    .map((characterId) => getCharacterProfile(characterProfiles, characterId))
    .filter(Boolean);
}

export function validateCharacterProfile({ name, personality }) {
  const normalizedName = String(name ?? '')
    .trim()
    .replace(/\s+/g, ' ');
  const normalizedPersonality = String(personality ?? '')
    .trim()
    .replace(/\s+/g, ' ');
  const personalityWordCount = countWords(normalizedPersonality);

  if (!normalizedName) {
    return {
      ok: false,
      error: 'Give the character a name before saving.',
      name: normalizedName,
      personality: normalizedPersonality,
      personalityWordCount,
    };
  }

  if (!normalizedPersonality) {
    return {
      ok: false,
      error: 'Give the character a personality before saving.',
      name: normalizedName,
      personality: normalizedPersonality,
      personalityWordCount,
    };
  }

  if (personalityWordCount > MAX_PERSONALITY_WORDS) {
    return {
      ok: false,
      error: `Keep the personality to ${MAX_PERSONALITY_WORDS} words or fewer.`,
      name: normalizedName,
      personality: normalizedPersonality,
      personalityWordCount,
    };
  }

  return {
    ok: true,
    error: '',
    name: normalizedName,
    personality: normalizedPersonality,
    personalityWordCount,
  };
}
