import { describe, it, expect, vi, beforeEach } from 'vitest';
import { conversationOrchestrator } from '../../src/services/conversationOrchestrator.js';
import { llmService } from '../../src/services/llmService.js';
import { fileService } from '../../src/services/fileService.js';

vi.mock('../../src/services/llmService.js');
vi.mock('../../src/services/fileService.js');

const TEST_PARAMS = {
  participants: ['husband', 'wife'],
  room: 'bedroom',
  config: {
    husband: { name: 'Arthur', model: 'test', endpoint: 'http://test', apiKey: 'key' },
    wife: { name: 'Eleanor', model: 'test', endpoint: 'http://test', apiKey: 'key' },
  },
  personalities: { husband: 'Husband personality.', wife: 'Wife personality.' },
  memories: { husband: '', wife: '' },
  roomInfluence: 'This room is reflective.',
  maxTurns: 4,
  day: 1,
  logType: 'couple',
  onTurnStart: vi.fn(),
  onChunk: vi.fn(),
  onTurnComplete: vi.fn(),
  onConversationComplete: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(llmService.streamCompletion).mockImplementation(async ({ onChunk, onComplete }) => {
    onChunk('A response.');
    onComplete('A response.');
  });

  vi.mocked(fileService.saveConversationLog).mockResolvedValue('day-1-test.md');
});

describe('conversationOrchestrator.runConversation', () => {
  it('starts with participants[0] and then alternates speakers', async () => {
    const speakers = [];
    await conversationOrchestrator.runConversation({
      ...TEST_PARAMS,
      onTurnStart: (speaker) => speakers.push(speaker),
    });

    expect(speakers).toEqual(['husband', 'wife', 'husband', 'wife']);
  });

  it('calls onChunk with the speaker and the chunk text', async () => {
    const chunks = [];
    await conversationOrchestrator.runConversation({
      ...TEST_PARAMS,
      onChunk: (speaker, chunk) => chunks.push({ speaker, chunk }),
    });

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]).toHaveProperty('speaker');
    expect(chunks[0]).toHaveProperty('chunk');
  });

  it('calls streamCompletion exactly maxTurns times', async () => {
    await conversationOrchestrator.runConversation(TEST_PARAMS);
    expect(llmService.streamCompletion).toHaveBeenCalledTimes(4);
  });

  it('injects wrap-up instruction in system prompt when nearing the turn limit', async () => {
    const systemPrompts = [];
    vi.mocked(llmService.streamCompletion).mockImplementation(async ({ messages, onChunk, onComplete }) => {
      systemPrompts.push(messages[0].content);
      onChunk('A response.');
      onComplete('A response.');
    });

    await conversationOrchestrator.runConversation(TEST_PARAMS);

    // With maxTurns=4: turns 3 and 4 are nearing end (2 or fewer remaining)
    expect(systemPrompts[0]).not.toMatch(/wrapping up/i);
    expect(systemPrompts[1]).not.toMatch(/wrapping up/i);
    expect(systemPrompts[2]).toMatch(/wrapping up/i);
    expect(systemPrompts[3]).toMatch(/wrapping up/i);
  });

  it('saves the conversation log after completion', async () => {
    await conversationOrchestrator.runConversation(TEST_PARAMS);
    expect(fileService.saveConversationLog).toHaveBeenCalledOnce();
    expect(fileService.saveConversationLog).toHaveBeenCalledWith(
      'couple',
      1,
      expect.any(String)
    );
  });

  it('calls onConversationComplete with the full transcript', async () => {
    const onConversationComplete = vi.fn();
    await conversationOrchestrator.runConversation({ ...TEST_PARAMS, onConversationComplete });

    expect(onConversationComplete).toHaveBeenCalledOnce();
    const transcript = onConversationComplete.mock.calls[0][0];
    expect(typeof transcript).toBe('string');
    expect(transcript).toMatch(/Arthur/);
    expect(transcript).toMatch(/Eleanor/);
  });

  it('includes each character personality in their system prompt', async () => {
    const systemPrompts = [];
    vi.mocked(llmService.streamCompletion).mockImplementation(async ({ messages, onChunk, onComplete }) => {
      systemPrompts.push(messages[0].content);
      onChunk('response');
      onComplete('response');
    });

    await conversationOrchestrator.runConversation(TEST_PARAMS);

    // Husband's turns (0, 2) should have husband's personality
    expect(systemPrompts[0]).toContain('Husband personality.');
    // Wife's turns (1, 3) should have wife's personality
    expect(systemPrompts[1]).toContain('Wife personality.');
  });
});
