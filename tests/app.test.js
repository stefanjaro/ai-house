// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';

describe('app interaction flow', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main id="app"></main>';
  });

  it('keeps the topic textarea focused while typing in the setup flow', () => {
    createApp(document.querySelector('#app'), {
      fetchImpl: vi.fn(),
    });

    navigateToTopicStep();

    const textarea = document.querySelector('#topic');
    textarea.focus();
    textarea.value = 'h';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    expect(document.activeElement).toBe(textarea);
    expect(document.querySelector('[data-role="topic-count"]').textContent).toBe('1 / 25 words');
  });

  it('lets the player backtrack and updates the confirmation summary', () => {
    createApp(document.querySelector('#app'), {
      fetchImpl: vi.fn(),
    });

    navigateToRoomStep();
    clickAction('pick-room', 'guest-bedroom');
    clickAction('next-step');
    clickAction('pick-speaker', 'wife');
    clickAction('back-step');
    clickAction('pick-room', 'sacrificial-altar');
    clickAction('next-step');
    clickAction('next-step');

    const textarea = document.querySelector('#topic');
    textarea.value = 'Should Jonah leave by Thursday?';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    clickAction('next-step');

    expect(document.querySelector('[data-role="confirmation-room"]').textContent).toContain('Sacrificial Altar');
    expect(document.querySelector('[data-role="confirmation-speaker"]').textContent).toContain('Mara');
    expect(document.querySelector('[data-role="confirmation-topic"]').textContent).toContain('Should Jonah leave by Thursday?');
  });

  it('reveals transcript turns only when the player advances the conversation', async () => {
    const firstTurnResponse = {
      ok: true,
      json: async () => ({
        turn: { speakerId: 'husband', text: 'First line.' },
      }),
    };
    let releaseSecondTurn;
    const secondTurnResponse = new Promise((resolve) => {
      releaseSecondTurn = () =>
        resolve({
          ok: true,
          json: async () => ({
            turn: { speakerId: 'wife', text: 'Second line.' },
          }),
        });
    });
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(firstTurnResponse)
      .mockImplementationOnce(() => secondTurnResponse);

    createApp(document.querySelector('#app'), { fetchImpl });

    navigateToConfirmationStep('Should we talk about Jonah?');
    clickAction('start-conversation');

    await vi.waitFor(() => {
      expect(document.querySelectorAll('.turn')).toHaveLength(1);
    });

    expect(document.querySelectorAll('.turn')).toHaveLength(1);
    expect(document.querySelector('.turn-index').textContent).toBe('01');
    expect(document.querySelector('[data-role="reveal-copy"]').textContent).toContain('Next turn');

    clickAction('reveal-next-turn');
    expect(document.querySelector('[data-role="reveal-copy"]').textContent).toContain('Loading');

    releaseSecondTurn();
    await vi.waitFor(() => {
      expect(document.querySelectorAll('.turn')).toHaveLength(2);
    });

    expect(Array.from(document.querySelectorAll('.turn-index')).map((node) => node.textContent)).toEqual(['01', '02']);
  });

  it('shows the full selection summary only on the confirmation step', () => {
    createApp(document.querySelector('#app'), {
      fetchImpl: vi.fn(),
    });

    navigateToRoomStep();
    expect(document.querySelector('[data-role="confirmation-room"]')).toBeNull();

    navigateToConfirmationStep('Should we talk about Jonah?');
    expect(document.querySelector('[data-role="confirmation-room"]').textContent).toContain('Living Room');
  });

  it('renders character portraits across setup, confirmation, and conversation', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        turn: { speakerId: 'husband', text: 'First line.' },
      }),
    });

    createApp(document.querySelector('#app'), { fetchImpl });

    expect(document.querySelectorAll('.card-portrait')).toHaveLength(3);

    navigateToConfirmationStep('Should we talk about Jonah?');
    expect(document.querySelectorAll('.review-portrait img')).toHaveLength(2);

    clickAction('start-conversation');

    await vi.waitFor(() => {
      expect(document.querySelectorAll('.turn-avatar')).toHaveLength(1);
    });

    expect(document.querySelectorAll('.fighter-avatar')).toHaveLength(2);
  });
});

function navigateToRoomStep() {
  clickAction('next-step');
}

function navigateToTopicStep() {
  clickAction('next-step');
  clickAction('next-step');
  clickAction('next-step');
}

function navigateToConfirmationStep(topic) {
  navigateToTopicStep();
  const textarea = document.querySelector('#topic');
  textarea.value = topic;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  clickAction('next-step');
}

function clickAction(action, value) {
  const selector = value
    ? `[data-action="${action}"][data-value="${value}"]`
    : `[data-action="${action}"]`;
  const target = document.querySelector(selector);

  if (!target) {
    throw new Error(`Missing action target: ${selector}`);
  }

  target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}
