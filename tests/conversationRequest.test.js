import { describe, expect, it } from 'vitest';
import { buildConversationRequest, extractTranscriptFromOutput } from '../src/lib/conversationRequest.js';
import { getCharacterById, getRoomById } from '../src/lib/gameData.js';

describe('conversation request shaping', () => {
  it('builds a room-aware provider payload for the selected duel', () => {
    const payload = buildConversationRequest({
      characters: [getCharacterById('husband'), getCharacterById('friend')],
      room: getRoomById('guest-bedroom'),
      startingSpeakerId: 'friend',
      topic: 'whether staying in the guest room is getting awkward',
    });

    expect(payload.model).toBe('gpt-5.4-nano');
    expect(payload.input).toHaveLength(2);
    expect(payload.input[0].content).toContain('guest bedroom');
    expect(payload.input[0].content).toContain('Elias');
    expect(payload.input[0].content).toContain('Jonah');
    expect(payload.input[1].content).toContain('"startingSpeakerId": "friend"');
    expect(payload.input[0].content).toContain('array of exactly 10 items');
    expect(payload.input[1].content).toContain('"topic": "whether staying in the guest room is getting awkward"');
  });

  it('parses JSON transcript output from the provider', () => {
    const transcript = extractTranscriptFromOutput(`{
      "turns": [
        { "speakerId": "wife", "text": "You are dodging the real point." },
        { "speakerId": "husband", "text": "[rubs neck] I know. I just wanted a calmer start." }
      ]
    }`);

    expect(transcript).toEqual([
      { speakerId: 'wife', text: 'You are dodging the real point.' },
      { speakerId: 'husband', text: '[rubs neck] I know. I just wanted a calmer start.' },
    ]);
  });

  it('recovers transcript turns when dialogue contains unescaped quotes', () => {
    const transcript = extractTranscriptFromOutput(`{
      "turns": [
        {
          "speakerId": "husband",
          "text": "What if we do the polite but clear thing, like "Thursday, then you're out.""
        },
        {
          "speakerId": "wife",
          "text": "Fine. Just say it directly."
        }
      ]
    }`);

    expect(transcript).toEqual([
      { speakerId: 'husband', text: `What if we do the polite but clear thing, like "Thursday, then you're out."` },
      { speakerId: 'wife', text: 'Fine. Just say it directly.' },
    ]);
  });
});
