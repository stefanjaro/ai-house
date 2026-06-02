import { describe, expect, it } from 'vitest';
import {
  buildMemoryCandidateRequest,
  extractMemoryCandidatesFromOutput,
  pickVisibleMemoryCandidates,
} from '../src/lib/memoryCandidates.js';
import { getCharacterById, getRoomById } from '../src/lib/gameData.js';

describe('memory candidate shaping', () => {
  it('builds a character-specific provider payload with journal and transcript context', () => {
    const payload = buildMemoryCandidateRequest({
      character: getCharacterById('wife'),
      otherCharacter: getCharacterById('friend'),
      room: getRoomById('guest-bedroom'),
      topic: 'whether Jonah should leave by Thursday',
      transcript: [
        { speakerId: 'wife', text: 'You keep saying temporary like it means nothing.' },
        { speakerId: 'friend', text: 'I know it means something. I just do not know what yet.' },
      ],
      existingJournal: ['Jonah keeps treating the guest room like a waiting room.'],
    });

    expect(payload.model).toBe('gpt-5.4-nano');
    expect(payload.input[0].content).toContain('Return an object with one key: "candidates".');
    expect(payload.input[0].content).toContain('exactly 5 items');
    expect(payload.input[0].content).toContain('15 words or fewer');
    expect(payload.input[0].content).toContain('UPDATE');
    expect(payload.input[1].content).toContain('"characterId": "wife"');
    expect(payload.input[1].content).toContain('"topic": "whether Jonah should leave by Thursday"');
    expect(payload.input[1].content).toContain('Jonah keeps treating the guest room like a waiting room.');
  });

  it('repairs malformed candidates into a safe UI shape', () => {
    const candidates = extractMemoryCandidatesFromOutput(
      `{
        "candidates": [
          {
            "type": "update",
            "text": "Jonah is not just passing through anymore, and Mara finally admitted that aloud. Another sentence.",
            "previousText": "Jonah keeps treating the guest room like a waiting room."
          },
          {
            "type": "new memory",
            "text": "Mara heard uncertainty in Jonah's joke and trusted it."
          }
        ]
      }`,
      {
        existingJournal: ['Jonah keeps treating the guest room like a waiting room.'],
      },
    );

    expect(candidates).toEqual([
      {
        type: 'UPDATE',
        text: 'Jonah is not just passing through anymore, and Mara finally admitted that aloud.',
        previousText: 'Jonah keeps treating the guest room like a waiting room.',
      },
      {
        type: 'NEW',
        text: "Mara heard uncertainty in Jonah's joke and trusted it.",
        previousText: '',
      },
    ]);
    expect(candidates[0].text.split(/\s+/)).toHaveLength(13);
  });

  it('randomizes the visible count within the supported range', () => {
    const visible = pickVisibleMemoryCandidates(
      [
        { type: 'NEW', text: 'One.', previousText: '' },
        { type: 'NEW', text: 'Two.', previousText: '' },
        { type: 'NEW', text: 'Three.', previousText: '' },
        { type: 'NEW', text: 'Four.', previousText: '' },
        { type: 'NEW', text: 'Five.', previousText: '' },
      ],
      { randomValue: 0.74 },
    );

    expect(visible).toHaveLength(5);
    expect(visible.map((candidate) => candidate.text)).toEqual(['One.', 'Two.', 'Three.', 'Four.', 'Five.']);
  });
});
