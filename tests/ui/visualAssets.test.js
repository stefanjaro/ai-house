// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeEach } from 'vitest';
import { createCenterScreen } from '../../src/ui/components/centerScreen.js';
import { createBottomBar } from '../../src/ui/components/bottomBar.js';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('visual assets', () => {
  it('uses SVG room backdrops in the center screen', () => {
    const { el, controller } = createCenterScreen();

    document.body.appendChild(el);
    controller.showRoom('bedroom', ['husband', 'wife']);

    const background = el.querySelector('.room-background');
    expect(background.getAttribute('src')).toBe('/assets/rooms/bedroom.svg');
  });

  it('uses SVG portraits for the bottom bar cards', () => {
    const bar = createBottomBar();

    document.body.appendChild(bar);

    const sprites = [...bar.querySelectorAll('.card-sprite')].map((img) => img.getAttribute('src'));
    expect(sprites).toEqual([
      '/assets/sprites/husband.svg',
      '/assets/sprites/wife.svg',
      '/assets/sprites/poltergeist.svg',
    ]);
  });

  it('keeps ornamental manuscript framing off the active playfield', () => {
    const css = readFileSync(resolve(TEST_DIR, '../../src/styles/main.css'), 'utf8');
    const centerScreenBlock = css.match(/#center-screen\s*\{[\s\S]*?\}/)?.[0] ?? '';

    expect(css).not.toContain('#center-screen::after');
    expect(centerScreenBlock).not.toContain('var(--ornament)');
  });
});
