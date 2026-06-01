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
    expect(document.querySelector('.card-portrait').getAttribute('src')).toMatch(/\.jpg$/);

    navigateToConfirmationStep('Should we talk about Jonah?');
    expect(document.querySelectorAll('.review-portrait img')).toHaveLength(2);
    expect(document.querySelector('.review-hero__art img').getAttribute('src')).toMatch(/\.jpg$/);

    clickAction('start-conversation');

    await vi.waitFor(() => {
      expect(document.querySelectorAll('.turn-avatar')).toHaveLength(1);
    });

    expect(document.querySelectorAll('.fighter-avatar')).toHaveLength(2);
  });

  it('persists edited character details into review, conversation, and request payloads', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        turn: { speakerId: 'husband', text: 'First line.' },
      }),
    });

    createApp(document.querySelector('#app'), { fetchImpl });

    clickAction('open-character-editor', 'husband');
    updateField('#character-name', 'Ash');
    updateField(
      '#character-personality',
      'Ash is clipped, skeptical, and rarely wastes words. He answers pressure with dry jokes and keeps trying to redirect the room toward practical exits.',
    );
    clickAction('save-character');

    navigateToConfirmationStep('Should we talk about Jonah?');
    expect(document.querySelector('[data-role="confirmation-characters"]').textContent).toContain('Ash');

    clickAction('start-conversation');

    await vi.waitFor(() => {
      expect(document.querySelectorAll('.fighter-avatar')).toHaveLength(2);
    });

    expect(document.querySelector('.fighter-name').textContent).toBe('Ash');

    const requestBody = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(requestBody.characters[0].name).toBe('Ash');
    expect(requestBody.characters[0].personality).toContain('skeptical');
  });

  it('blocks saving a personality above the 250-word limit', () => {
    createApp(document.querySelector('#app'), {
      fetchImpl: vi.fn(),
    });

    clickAction('open-character-editor', 'wife');
    updateField(
      '#character-personality',
      Array.from({ length: 251 }, (_, index) => `word${index + 1}`).join(' '),
    );
    clickAction('save-character');

    expect(document.querySelector('[data-role="character-error"]').textContent).toContain('250 words or fewer');
    expect(document.querySelector('[data-role="personality-count"]').textContent).toBe('251 / 250 words');
  });

  it('lets the player inspect current personalities during conversation', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        turn: { speakerId: 'wife', text: 'First line.' },
      }),
    });

    createApp(document.querySelector('#app'), { fetchImpl });

    navigateToConfirmationStep('Should we talk about Jonah?');
    clickAction('start-conversation');

    await vi.waitFor(() => {
      expect(document.querySelectorAll('.fighter-avatar')).toHaveLength(2);
    });

    clickAction('inspect-character', 'wife');

    expect(document.querySelector('[data-role="character-panel-title"]').textContent).toContain('Mara');
    expect(document.querySelector('.character-panel__body').textContent).toContain('emotionally honest');
  });

  it('opens personality inspection from clickable portraits in review and conversation', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        turn: { speakerId: 'wife', text: 'First line.' },
      }),
    });

    createApp(document.querySelector('#app'), { fetchImpl });

    navigateToConfirmationStep('Should we talk about Jonah?');
    clickAction('inspect-character', 'husband');
    expect(document.querySelector('[data-role="character-panel-title"]').textContent).toContain('Elias');
    clickAction('close-character-panel');

    clickAction('start-conversation');
    await vi.waitFor(() => {
      expect(document.querySelectorAll('.fighter-avatar')).toHaveLength(2);
    });

    clickAction('inspect-character', 'husband');
    expect(document.querySelector('[data-role="character-panel-title"]').textContent).toContain('Elias');
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

function updateField(selector, value) {
  const target = document.querySelector(selector);
  target.value = value;
  target.dispatchEvent(new Event('input', { bubbles: true }));
}
