// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCharacterCreationScreen } from '../../src/ui/screens/characterCreationScreen.js';

const mockConfig = {
  husband: { name: 'Arthur', model: 'gpt-4o' },
  wife: { name: 'Eleanor', model: 'gpt-4o' },
  poltergeist: { name: 'Mischief', model: 'o3-mini' },
};

const mockPersonalities = {
  husband: 'Husband personality text.',
  wife: 'Wife personality text.',
  poltergeist: 'Poltergeist personality text.',
};

function buildScreen() {
  const onBegin = vi.fn();
  const setPersonality = vi.fn().mockResolvedValue({});
  const screen = createCharacterCreationScreen({
    config: mockConfig,
    personalities: mockPersonalities,
    onBegin,
    setPersonality,
  });
  document.body.appendChild(screen);
  return { screen, onBegin, setPersonality };
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('Character creation screen — name validation', () => {
  it('"Begin" button is disabled when any name field is empty', () => {
    const { screen } = buildScreen();
    const husbandInput = screen.querySelector('[data-name="husband"]');
    husbandInput.value = '';
    husbandInput.dispatchEvent(new Event('input'));
    const btn = screen.querySelector('.begin-btn');
    expect(btn.disabled).toBe(true);
  });

  it('"Begin" button is enabled when all names are filled', () => {
    const { screen } = buildScreen();
    // All names pre-filled from config — button should be enabled initially
    const btn = screen.querySelector('.begin-btn');
    expect(btn.disabled).toBe(false);
  });

  it('"Begin" button becomes disabled after clearing a name, then re-enabled after refilling', () => {
    const { screen } = buildScreen();
    const wifeInput = screen.querySelector('[data-name="wife"]');
    wifeInput.value = '';
    wifeInput.dispatchEvent(new Event('input'));
    const btn = screen.querySelector('.begin-btn');
    expect(btn.disabled).toBe(true);

    wifeInput.value = 'Eleanor';
    wifeInput.dispatchEvent(new Event('input'));
    expect(btn.disabled).toBe(false);
  });
});

describe('Character creation screen — poltergeist personality', () => {
  it('uses SVG portraits for each character card', () => {
    const { screen } = buildScreen();
    const sprites = [...screen.querySelectorAll('.creation-sprite')].map((img) => img.getAttribute('src'));

    expect(sprites).toEqual([
      '/assets/sprites/husband.svg',
      '/assets/sprites/wife.svg',
      '/assets/sprites/poltergeist.svg',
    ]);
  });

  it('poltergeist personality field is read-only', () => {
    const { screen } = buildScreen();
    const poltergeistPersonality = screen.querySelector('[data-personality="poltergeist"]');
    expect(poltergeistPersonality).not.toBeNull();
    expect(poltergeistPersonality.readOnly).toBe(true);
  });

  it('husband and wife personality fields are editable', () => {
    const { screen } = buildScreen();
    expect(screen.querySelector('[data-personality="husband"]').readOnly).toBe(false);
    expect(screen.querySelector('[data-personality="wife"]').readOnly).toBe(false);
  });
});

describe('Character creation screen — submit', () => {
  it('calls setPersonality for husband and wife but not poltergeist on begin', async () => {
    const { screen, setPersonality } = buildScreen();
    const btn = screen.querySelector('.begin-btn');
    btn.click();
    await vi.waitFor(() => expect(setPersonality).toHaveBeenCalledTimes(2));
    const calls = setPersonality.mock.calls.map(c => c[0]);
    expect(calls).toContain('husband');
    expect(calls).toContain('wife');
    expect(calls).not.toContain('poltergeist');
  });

  it('passes character names to onBegin callback', async () => {
    const { screen, onBegin } = buildScreen();
    const btn = screen.querySelector('.begin-btn');
    btn.click();
    await vi.waitFor(() => expect(onBegin).toHaveBeenCalled());
    const names = onBegin.mock.calls[0][0];
    expect(names).toMatchObject({ husband: 'Arthur', wife: 'Eleanor', poltergeist: 'Mischief' });
  });

  it('passes updated names when name fields are changed before submit', async () => {
    const { screen, onBegin } = buildScreen();
    const husbandInput = screen.querySelector('[data-name="husband"]');
    husbandInput.value = 'Bertrand';
    husbandInput.dispatchEvent(new Event('input'));
    screen.querySelector('.begin-btn').click();
    await vi.waitFor(() => expect(onBegin).toHaveBeenCalled());
    expect(onBegin.mock.calls[0][0].husband).toBe('Bertrand');
  });
});
