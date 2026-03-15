import { describe, it, expect } from 'vitest';
import {
  createGameState,
  startDay,
  completeActivity,
  isGameOver,
  getCurrentDay,
} from '../../src/engine/dayManager.js';

const TEST_CONFIG = {
  husband: { name: 'Arthur', model: 'test', endpoint: 'http://test', apiKey: 'key' },
  wife: { name: 'Eleanor', model: 'test', endpoint: 'http://test', apiKey: 'key' },
  poltergeist: { name: 'Mischief', model: 'test', endpoint: 'http://test', apiKey: 'key' },
};

describe('createGameState', () => {
  it('starts at day 1', () => {
    const state = createGameState(TEST_CONFIG);
    expect(state.currentDay).toBe(1);
  });

  it('sets totalDays to 10', () => {
    const state = createGameState(TEST_CONFIG);
    expect(state.totalDays).toBe(10);
  });

  it('has no selections yet (today is null)', () => {
    const state = createGameState(TEST_CONFIG);
    expect(state.today).toBeNull();
  });

  it('has no previous day rooms', () => {
    const state = createGameState(TEST_CONFIG);
    expect(state.previousDayRooms).toBeNull();
  });

  it('stores character info from config', () => {
    const state = createGameState(TEST_CONFIG);
    expect(state.characters.husband.name).toBe('Arthur');
    expect(state.characters.wife.name).toBe('Eleanor');
    expect(state.characters.poltergeist.name).toBe('Mischief');
  });
});

describe('startDay', () => {
  it('populates today with all required random selections', () => {
    let state = createGameState(TEST_CONFIG);
    state = startDay(state);
    expect(state.today.poltergeistTarget).toMatch(/^(husband|wife)$/);
    expect(state.today.coupleRoom).toBeTruthy();
    expect(state.today.poltergeistRoom).toBeTruthy();
    expect(state.today.conversationStarter).toMatch(/^(husband|wife)$/);
    expect(state.today.completedActivities).toEqual([]);
  });

  it('the two selected rooms are always different', () => {
    for (let i = 0; i < 20; i++) {
      let state = createGameState(TEST_CONFIG);
      state = startDay(state);
      expect(state.today.coupleRoom).not.toBe(state.today.poltergeistRoom);
    }
  });

  it('throws when attempting to start day beyond the game', () => {
    let state = createGameState(TEST_CONFIG);
    state = { ...state, currentDay: 12 };
    expect(() => startDay(state)).toThrow();
  });
});

describe('completeActivity', () => {
  it('marks an activity as completed', () => {
    let state = createGameState(TEST_CONFIG);
    state = startDay(state);
    state = completeActivity(state, 'couple-conversation');
    expect(state.today.completedActivities).toContain('couple-conversation');
  });

  it('can mark multiple activities', () => {
    let state = createGameState(TEST_CONFIG);
    state = startDay(state);
    state = completeActivity(state, 'couple-conversation');
    state = completeActivity(state, 'poltergeist-conversation');
    expect(state.today.completedActivities).toContain('couple-conversation');
    expect(state.today.completedActivities).toContain('poltergeist-conversation');
  });

  it('advances currentDay after sleep and records previous rooms', () => {
    let state = createGameState(TEST_CONFIG);
    state = startDay(state);
    const rooms = [state.today.coupleRoom, state.today.poltergeistRoom];
    state = completeActivity(state, 'sleep');
    expect(state.currentDay).toBe(2);
    expect(state.previousDayRooms).toEqual(rooms);
    expect(state.today).toBeNull();
  });
});

describe('isGameOver', () => {
  it('returns false on day 1', () => {
    const state = createGameState(TEST_CONFIG);
    expect(isGameOver(state)).toBe(false);
  });

  it('returns false on day 10', () => {
    let state = createGameState(TEST_CONFIG);
    state = { ...state, currentDay: 10 };
    expect(isGameOver(state)).toBe(false);
  });

  it('returns true when currentDay exceeds totalDays', () => {
    let state = createGameState(TEST_CONFIG);
    state = { ...state, currentDay: 11 };
    expect(isGameOver(state)).toBe(true);
  });
});

describe('getCurrentDay', () => {
  it('returns the current day number', () => {
    const state = createGameState(TEST_CONFIG);
    expect(getCurrentDay(state)).toBe(1);
  });
});
