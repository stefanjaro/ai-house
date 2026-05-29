// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';

describe('app interaction flow', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main id="app"></main>';
  });

  it('keeps the topic textarea focused while typing', async () => {
    createApp(document.querySelector('#app'), {
      fetchImpl: vi.fn(),
      wait: vi.fn(),
    });

    const textarea = document.querySelector('#topic');
    textarea.focus();
    textarea.value = 'h';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    expect(document.activeElement).toBe(textarea);
    expect(document.querySelector('[data-role="topic-count"]').textContent).toBe('1 / 25 words');
  });

  it('shows numbered transcript turns with a loader between messages', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        transcript: [
          { speakerId: 'husband', text: 'First line.' },
          { speakerId: 'wife', text: 'Second line.' },
        ],
      }),
    });

    createApp(document.querySelector('#app'), {
      fetchImpl,
      wait: (duration) => new Promise((resolve) => setTimeout(resolve, duration)),
    });

    const textarea = document.querySelector('#topic');
    textarea.value = 'Should we talk about Jonah?';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#setup-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(document.querySelectorAll('.turn')).toHaveLength(1);
    });

    expect(document.querySelector('.turn-index').textContent).toBe('01');
    expect(document.querySelector('.loader-turn .loader-speaker').textContent).toContain('Mara');

    await vi.advanceTimersByTimeAsync(1000);

    expect(document.querySelectorAll('.turn')).toHaveLength(2);
    expect(Array.from(document.querySelectorAll('.turn-index')).map((node) => node.textContent)).toEqual(['01', '02']);
    expect(document.querySelector('.loader-turn')).toBeNull();

    vi.useRealTimers();
  });
});
