import { describe, it, expect, vi, beforeEach } from 'vitest';
import { llmService } from '../../src/services/llmService.js';

function makeSseChunk(content, reasoningContent) {
  const delta = { content };
  if (reasoningContent !== undefined) delta.reasoning_content = reasoningContent;
  return `data: ${JSON.stringify({ choices: [{ delta }] })}\n\n`;
}

function createMockStream(sseLines) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const line of sseLines) {
        controller.enqueue(encoder.encode(line));
      }
      controller.close();
    },
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('llmService.streamCompletion', () => {
  it('calls onChunk for each content delta and assembles full text', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      body: createMockStream([
        makeSseChunk('Hello'),
        makeSseChunk(', '),
        makeSseChunk('world!'),
        'data: [DONE]\n\n',
      ]),
    }));

    const onChunk = vi.fn();
    const onComplete = vi.fn();

    await llmService.streamCompletion({
      endpoint: 'https://test.api/v1',
      apiKey: 'test-key',
      model: 'test-model',
      messages: [{ role: 'user', content: 'Hi' }],
      onChunk,
      onComplete,
    });

    expect(onChunk).toHaveBeenCalledTimes(3);
    expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello');
    expect(onChunk).toHaveBeenNthCalledWith(2, ', ');
    expect(onChunk).toHaveBeenNthCalledWith(3, 'world!');
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith('Hello, world!');
  });

  it('ignores reasoning_content from thinking models', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      body: createMockStream([
        makeSseChunk('The answer is 42.', 'Let me think about this carefully...'),
        'data: [DONE]\n\n',
      ]),
    }));

    const onChunk = vi.fn();
    const onComplete = vi.fn();

    await llmService.streamCompletion({
      endpoint: 'https://test.api/v1',
      apiKey: 'test-key',
      model: 'kimi-k2.5',
      messages: [],
      onChunk,
      onComplete,
    });

    expect(onChunk).toHaveBeenCalledOnce();
    expect(onChunk).toHaveBeenCalledWith('The answer is 42.');
    expect(onComplete).toHaveBeenCalledWith('The answer is 42.');
  });

  it('skips delta chunks with no content', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      body: createMockStream([
        `data: ${JSON.stringify({ choices: [{ delta: {} }] })}\n\n`,  // no content field
        makeSseChunk('Real content'),
        'data: [DONE]\n\n',
      ]),
    }));

    const onChunk = vi.fn();
    const onComplete = vi.fn();

    await llmService.streamCompletion({
      endpoint: 'https://test.api/v1',
      apiKey: 'test-key',
      model: 'test-model',
      messages: [],
      onChunk,
      onComplete,
    });

    expect(onChunk).toHaveBeenCalledOnce();
    expect(onChunk).toHaveBeenCalledWith('Real content');
  });

  it('calls the endpoint with correct URL and auth header', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: createMockStream(['data: [DONE]\n\n']),
    });
    vi.stubGlobal('fetch', mockFetch);

    await llmService.streamCompletion({
      endpoint: 'https://opencode.ai/zen/v1',
      apiKey: 'my-secret-key',
      model: 'kimi-k2',
      messages: [{ role: 'user', content: 'Hello' }],
      onChunk: vi.fn(),
      onComplete: vi.fn(),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://opencode.ai/zen/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer my-secret-key',
          'Content-Type': 'application/json',
        }),
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.stream).toBe(true);
    expect(body.model).toBe('kimi-k2');
  });

  it('throws when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    }));

    await expect(
      llmService.streamCompletion({
        endpoint: 'https://test.api/v1',
        apiKey: 'bad-key',
        model: 'test-model',
        messages: [],
        onChunk: vi.fn(),
        onComplete: vi.fn(),
      })
    ).rejects.toThrow('401');
  });
});
