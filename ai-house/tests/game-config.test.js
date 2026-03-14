import { describe, it, expect } from 'vitest';
import { gameConfig } from '../src/game-config.js';

describe('gameConfig', () => {
  it('has width of 960', () => {
    expect(gameConfig.width).toBe(960);
  });

  it('has height of 640', () => {
    expect(gameConfig.height).toBe(640);
  });

  it('has pixelArt set to true', () => {
    expect(gameConfig.pixelArt).toBe(true);
  });

  it('has antialias set to false', () => {
    expect(gameConfig.antialias).toBe(false);
  });

  it('has at least one scene', () => {
    expect(Array.isArray(gameConfig.scene)).toBe(true);
    expect(gameConfig.scene.length).toBeGreaterThan(0);
  });
});
