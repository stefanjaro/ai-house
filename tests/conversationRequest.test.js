import { describe, expect, it } from 'vitest';
import {
  buildConversationRequest,
  buildConversationTurnRequest,
  extractTranscriptFromOutput,
  extractTurnFromOutput,
} from '../src/lib/conversationRequest.js';
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
    expect(payload.input[0].content).toContain('Guest Bedroom');
    expect(payload.input[0].content).toContain('Elias');
    expect(payload.input[0].content).toContain('Jonah');
    expect(payload.input[1].content).toContain('"startingSpeakerId": "friend"');
    expect(payload.input[0].content).toContain('array of exactly 10 items');
    expect(payload.input[1].content).toContain('"topic": "whether staying in the guest room is getting awkward"');
    expect(payload.input[0].content).toContain('Keep it simple. No fancy writing.');
    expect(payload.input[0].content).toContain('The scene should feel funny, weird, petty, playful, or a little stupid in a good way.');
    expect(payload.input[0].content).toContain('Each line still has to match the speaker.');
    expect(payload.input[0].content).toContain('Do not introduce people outside the house cast.');
    expect(payload.input[0].content).toContain('Keep the relationship history alive.');
  });

  it('adds explicit altar inversion rules without discarding the base personality constraint', () => {
    const payload = buildConversationRequest({
      characters: [getCharacterById('husband'), getCharacterById('wife')],
      room: getRoomById('sacrificial-altar'),
      startingSpeakerId: 'husband',
      topic: 'whether Jonah should keep staying here',
    });

    expect(payload.input[0].content).toContain('Each line still has to match the speaker.');
    expect(payload.input[0].content).toContain("This room flips each character's main vibe on its head.");
    expect(payload.input[0].content).toContain('A peacemaker should stir trouble');
    expect(payload.input[0].content).toContain('Make the inversion obvious and a little funny, not subtle.');
    expect(payload.input[1].content).toContain('"id": "sacrificial-altar"');
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

  it('builds a single-turn payload with prior context and expected speaker', () => {
    const payload = buildConversationTurnRequest({
      characters: [
        {
          ...getCharacterById('husband'),
          name: 'Ash',
          personality: 'Ash is terse, guarded, and constantly scanning for the weak point in a conversation.',
        },
        getCharacterById('friend'),
      ],
      room: getRoomById('guest-bedroom'),
      startingSpeakerId: 'friend',
      topic: 'whether staying in the guest room is getting awkward',
      transcriptSoFar: [{ speakerId: 'friend', text: 'I can leave, if that is what this is.' }],
      turnNumber: 2,
    });

    expect(payload.input[0].content).toContain('This is turn 2 of 10.');
    expect(payload.input[0].content).toContain('The speaker for this turn must be "husband".');
    expect(payload.input[0].content).toContain('1. friend: I can leave, if that is what this is.');
    expect(payload.input[0].content).toContain('Ash is terse, guarded');
    expect(payload.input[0].content).toContain('Ash, Husband');
    expect(payload.input[0].content).toContain('Let the line fit the speaker.');
    expect(payload.input[0].content).toContain('Relationship context:');
    expect(payload.input[0].content).toContain("Jonah is Elias's longtime friend");
  });

  it('parses a single-turn provider response', () => {
    const turn = extractTurnFromOutput(`{
      "speakerId": "wife",
      "text": "Then stop circling it and say what you want."
    }`);

    expect(turn).toEqual({
      speakerId: 'wife',
      text: 'Then stop circling it and say what you want.',
    });
  });
});
