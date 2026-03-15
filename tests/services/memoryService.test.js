import { describe, it, expect, vi, beforeEach } from 'vitest';
import { memoryService } from '../../src/services/memoryService.js';
import { llmService } from '../../src/services/llmService.js';
import { fileService } from '../../src/services/fileService.js';

vi.mock('../../src/services/llmService.js');
vi.mock('../../src/services/fileService.js');

function mockLlm(response) {
  vi.mocked(llmService.streamCompletion).mockImplementation(async ({ onChunk, onComplete }) => {
    onChunk(response);
    onComplete(response);
  });
}

const BASE_PARAMS = {
  character: 'husband',
  dayConversations: ['Husband: Hello.\nWife: Hi there.'],
  config: { endpoint: 'http://test', apiKey: 'key', model: 'test-model' },
  personality: 'Arthur is a kind and patient man.',
  currentMemory: ['Memory item 1', 'Memory item 2', 'Memory item 3'],
  maxNewItems: 5,
  maxTotalItems: 20,
  onThought: vi.fn(),
  onComplete: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fileService.setMemory).mockResolvedValue({ ok: true });
});

describe('memoryService.reflectAndUpdate', () => {
  it('adds new memory items when below capacity', async () => {
    mockLlm('NEW MEMORIES:\n1. New insight gained today\n2. Another thing to remember\n\nDISCARD:\n');

    await memoryService.reflectAndUpdate(BASE_PARAMS);

    expect(fileService.setMemory).toHaveBeenCalledOnce();
    const [character, content] = vi.mocked(fileService.setMemory).mock.calls[0];
    expect(character).toBe('husband');
    expect(content).toContain('New insight gained today');
    expect(content).toContain('Another thing to remember');
    expect(content).toContain('Memory item 1');
    expect(content).toContain('Memory item 2');
    expect(content).toContain('Memory item 3');
  });

  it('removes discarded items and adds new ones when at capacity', async () => {
    const atCapacityMemory = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    mockLlm('NEW MEMORIES:\n1. Fresh memory\n\nDISCARD:\n1. Item 1\n2. Item 2\n');

    await memoryService.reflectAndUpdate({
      ...BASE_PARAMS,
      currentMemory: atCapacityMemory,
      maxNewItems: 2,
      maxTotalItems: 5,
    });

    expect(fileService.setMemory).toHaveBeenCalledOnce();
    const [, content] = vi.mocked(fileService.setMemory).mock.calls[0];
    expect(content).toContain('Fresh memory');
    expect(content).not.toContain('Item 1');
    expect(content).not.toContain('Item 2');
    const lines = content.trim().split('\n').filter((l) => l.trim());
    expect(lines.length).toBeLessThanOrEqual(5);
  });

  it('leaves memory unchanged and logs a warning when applying update would exceed capacity', async () => {
    const atCapacityMemory = ['Item 1', 'Item 2', 'Item 3'];
    // LLM adds new item without discarding any — would exceed maxTotalItems of 3
    mockLlm('NEW MEMORIES:\n1. Brand new memory\n\nDISCARD:\n');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await memoryService.reflectAndUpdate({
      ...BASE_PARAMS,
      currentMemory: atCapacityMemory,
      maxNewItems: 2,
      maxTotalItems: 3,
    });

    expect(fileService.setMemory).toHaveBeenCalledOnce();
    const [, content] = vi.mocked(fileService.setMemory).mock.calls[0];
    expect(content).not.toContain('Brand new memory');
    const lines = content.trim().split('\n').filter((l) => l.trim());
    expect(lines.length).toBe(3);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('calls onThought at least once during reflection', async () => {
    mockLlm('NEW MEMORIES:\n1. Something\n\nDISCARD:\n');
    const onThought = vi.fn();

    await memoryService.reflectAndUpdate({ ...BASE_PARAMS, onThought });

    expect(onThought).toHaveBeenCalled();
  });

  it('calls fileService.setMemory with the character name and updated content', async () => {
    mockLlm('NEW MEMORIES:\n1. Something new\n\nDISCARD:\n');

    await memoryService.reflectAndUpdate(BASE_PARAMS);

    expect(fileService.setMemory).toHaveBeenCalledOnce();
    expect(fileService.setMemory).toHaveBeenCalledWith('husband', expect.any(String));
  });

  it('calls onComplete with the updated memory text', async () => {
    mockLlm('NEW MEMORIES:\n1. New item\n\nDISCARD:\n');
    const onComplete = vi.fn();

    await memoryService.reflectAndUpdate({ ...BASE_PARAMS, onComplete });

    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith(expect.stringContaining('New item'));
  });

  it('includes personality and current memory items in the LLM prompt', async () => {
    mockLlm('NEW MEMORIES:\n\nDISCARD:\n');

    await memoryService.reflectAndUpdate(BASE_PARAMS);

    const { messages } = vi.mocked(llmService.streamCompletion).mock.calls[0][0];
    const fullPrompt = messages.map((m) => m.content).join('\n');
    expect(fullPrompt).toContain('Arthur is a kind and patient man.');
    expect(fullPrompt).toContain('Memory item 1');
  });

  it('includes today\'s conversations in the LLM prompt', async () => {
    mockLlm('NEW MEMORIES:\n\nDISCARD:\n');

    await memoryService.reflectAndUpdate(BASE_PARAMS);

    const { messages } = vi.mocked(llmService.streamCompletion).mock.calls[0][0];
    const fullPrompt = messages.map((m) => m.content).join('\n');
    expect(fullPrompt).toContain('Husband: Hello.');
  });

  it('does not add duplicate memories that already exist in current memory', async () => {
    // LLM echoes back items that are already in memory (the bug scenario)
    mockLlm('NEW MEMORIES:\n1. Memory item 1\n2. Memory item 2\n3. Genuinely new thing\n\nDISCARD:\n');

    await memoryService.reflectAndUpdate(BASE_PARAMS);

    const [, content] = vi.mocked(fileService.setMemory).mock.calls[0];
    expect(content).toContain('Genuinely new thing');
    // Should only appear once each
    const lines = content.trim().split('\n').filter((l) => l.trim());
    const item1Count = lines.filter((l) => l === 'Memory item 1').length;
    const item2Count = lines.filter((l) => l === 'Memory item 2').length;
    expect(item1Count).toBe(1);
    expect(item2Count).toBe(1);
  });

  it('handles empty conversation list gracefully', async () => {
    mockLlm('NEW MEMORIES:\n1. A quiet day\n\nDISCARD:\n');

    await expect(
      memoryService.reflectAndUpdate({ ...BASE_PARAMS, dayConversations: [] })
    ).resolves.not.toThrow();

    expect(fileService.setMemory).toHaveBeenCalledOnce();
  });
});
