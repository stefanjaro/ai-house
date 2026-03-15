import { describe, it, expect } from 'vitest';
import { canEnter, BLOCKED_RULES } from '../../src/characters/RoomAccessRules.js';

describe('BLOCKED_RULES', () => {
  it('has exactly 3 entries', () => {
    expect(BLOCKED_RULES).toHaveLength(3);
  });

  it('blocks poltergeist from bedroom', () => {
    expect(BLOCKED_RULES).toContainEqual({ characterId: 'poltergeist', roomId: 'bedroom' });
  });

  it('blocks husband from mystery_room', () => {
    expect(BLOCKED_RULES).toContainEqual({ characterId: 'husband', roomId: 'mystery_room' });
  });

  it('blocks wife from mystery_room', () => {
    expect(BLOCKED_RULES).toContainEqual({ characterId: 'wife', roomId: 'mystery_room' });
  });
});

describe('canEnter', () => {
  it('husband can enter bedroom', () => {
    expect(canEnter('husband', 'bedroom')).toBe(true);
  });

  it('wife can enter bedroom', () => {
    expect(canEnter('wife', 'bedroom')).toBe(true);
  });

  it('poltergeist cannot enter bedroom', () => {
    expect(canEnter('poltergeist', 'bedroom')).toBe(false);
  });

  it('husband cannot enter mystery_room', () => {
    expect(canEnter('husband', 'mystery_room')).toBe(false);
  });

  it('wife cannot enter mystery_room', () => {
    expect(canEnter('wife', 'mystery_room')).toBe(false);
  });

  it('poltergeist can enter mystery_room', () => {
    expect(canEnter('poltergeist', 'mystery_room')).toBe(true);
  });

  it('poltergeist can enter living_room', () => {
    expect(canEnter('poltergeist', 'living_room')).toBe(true);
  });

  it('poltergeist can enter kitchen', () => {
    expect(canEnter('poltergeist', 'kitchen')).toBe(true);
  });

  it('husband can enter living_room', () => {
    expect(canEnter('husband', 'living_room')).toBe(true);
  });

  it('husband can enter kitchen', () => {
    expect(canEnter('husband', 'kitchen')).toBe(true);
  });
});
