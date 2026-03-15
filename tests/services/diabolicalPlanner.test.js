import { describe, it, expect, vi, beforeEach } from 'vitest';
import { diabolicalPlanner } from '../../src/services/diabolicalPlanner.js';
import { llmService } from '../../src/services/llmService.js';

vi.mock('../../src/services/llmService.js');

const TEST_PARAMS = {
  config: {
    poltergeist: { name: 'Mischief', model: 'test', endpoint: 'http://test', apiKey: 'key' },
  },
  personality: 'You are a mischievous imp.',
  memory: 'I almost got them yesterday.',
  previousPlan: null,
  onChunk: vi.fn(),
  onComplete: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(llmService.streamCompletion).mockImplementation(async ({ onChunk, onComplete }) => {
    onChunk('Heh heh heh...');
    onComplete('Heh heh heh...');
  });
});

describe('diabolicalPlanner.runMonologue', () => {
  it('calls onChunk and onComplete with the monologue text', async () => {
    const onChunk = vi.fn();
    const onComplete = vi.fn();

    await diabolicalPlanner.runMonologue({ ...TEST_PARAMS, onChunk, onComplete });

    expect(onChunk).toHaveBeenCalledWith('Heh heh heh...');
    expect(onComplete).toHaveBeenCalledWith('Heh heh heh...');
  });

  it('calls streamCompletion with the poltergeist config', async () => {
    await diabolicalPlanner.runMonologue(TEST_PARAMS);

    expect(llmService.streamCompletion).toHaveBeenCalledOnce();
    expect(llmService.streamCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: 'http://test',
        apiKey: 'key',
        model: 'test',
      })
    );
  });

  it('includes personality in the system prompt', async () => {
    let capturedMessages;
    vi.mocked(llmService.streamCompletion).mockImplementation(async ({ messages, onChunk, onComplete }) => {
      capturedMessages = messages;
      onChunk('plan');
      onComplete('plan');
    });

    await diabolicalPlanner.runMonologue(TEST_PARAMS);

    const systemPrompt = capturedMessages[0].content;
    expect(systemPrompt).toContain('You are a mischievous imp.');
  });

  it('includes memory in the system prompt when provided', async () => {
    let capturedMessages;
    vi.mocked(llmService.streamCompletion).mockImplementation(async ({ messages, onChunk, onComplete }) => {
      capturedMessages = messages;
      onChunk('plan');
      onComplete('plan');
    });

    await diabolicalPlanner.runMonologue(TEST_PARAMS);

    const systemPrompt = capturedMessages[0].content;
    expect(systemPrompt).toContain('I almost got them yesterday.');
  });

  it('includes the previous plan for continuity when provided', async () => {
    let capturedMessages;
    vi.mocked(llmService.streamCompletion).mockImplementation(async ({ messages, onChunk, onComplete }) => {
      capturedMessages = messages;
      onChunk('new plan');
      onComplete('new plan');
    });

    await diabolicalPlanner.runMonologue({
      ...TEST_PARAMS,
      previousPlan: 'Yesterday I tried to make them argue about dinner.',
    });

    const fullPromptText = capturedMessages.map((m) => m.content).join(' ');
    expect(fullPromptText).toContain('Yesterday I tried to make them argue about dinner.');
  });
});
