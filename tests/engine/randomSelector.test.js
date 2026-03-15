import { describe, it, expect } from 'vitest';
import {
  selectPoltergeistTarget,
  selectConversationRooms,
  selectConversationStarter,
} from '../../src/engine/randomSelector.js';

const VALID_ROOMS = ['bedroom', 'kitchen', 'living-room'];

describe('selectPoltergeistTarget', () => {
  it('returns only "husband" or "wife"', () => {
    for (let i = 0; i < 50; i++) {
      expect(['husband', 'wife']).toContain(selectPoltergeistTarget());
    }
  });

  it('returns both values over many runs', () => {
    const results = new Set(Array.from({ length: 100 }, () => selectPoltergeistTarget()));
    expect(results.has('husband')).toBe(true);
    expect(results.has('wife')).toBe(true);
  });
});

describe('selectConversationStarter', () => {
  it('returns only "husband" or "wife"', () => {
    for (let i = 0; i < 50; i++) {
      expect(['husband', 'wife']).toContain(selectConversationStarter());
    }
  });

  it('returns both values over many runs', () => {
    const results = new Set(Array.from({ length: 100 }, () => selectConversationStarter()));
    expect(results.has('husband')).toBe(true);
    expect(results.has('wife')).toBe(true);
  });
});

describe('selectConversationRooms', () => {
  it('never returns mystery-room', () => {
    for (let i = 0; i < 50; i++) {
      const { coupleRoom, poltergeistRoom } = selectConversationRooms();
      expect(coupleRoom).not.toBe('mystery-room');
      expect(poltergeistRoom).not.toBe('mystery-room');
    }
  });

  it('never returns the same room for both conversations', () => {
    for (let i = 0; i < 50; i++) {
      const { coupleRoom, poltergeistRoom } = selectConversationRooms();
      expect(coupleRoom).not.toBe(poltergeistRoom);
    }
  });

  it('returns only valid rooms', () => {
    for (let i = 0; i < 50; i++) {
      const { coupleRoom, poltergeistRoom } = selectConversationRooms();
      expect(VALID_ROOMS).toContain(coupleRoom);
      expect(VALID_ROOMS).toContain(poltergeistRoom);
    }
  });

  it('excludes previous day rooms when 2+ alternatives remain', () => {
    // Excluding only 'bedroom' leaves kitchen + living-room — enough for 2
    for (let i = 0; i < 50; i++) {
      const { coupleRoom, poltergeistRoom } = selectConversationRooms(['bedroom']);
      expect(coupleRoom).not.toBe('bedroom');
      expect(poltergeistRoom).not.toBe('bedroom');
    }
  });

  it('falls back to all rooms when too few alternatives remain', () => {
    // Excluding 2 of 3 rooms leaves only 1 — must fall back and still return 2 different rooms
    for (let i = 0; i < 20; i++) {
      const { coupleRoom, poltergeistRoom } = selectConversationRooms(['bedroom', 'kitchen']);
      expect(coupleRoom).not.toBe(poltergeistRoom);
      expect(VALID_ROOMS).toContain(coupleRoom);
      expect(VALID_ROOMS).toContain(poltergeistRoom);
    }
  });

  it('works with no previous day (day 1)', () => {
    const { coupleRoom, poltergeistRoom } = selectConversationRooms(null);
    expect(VALID_ROOMS).toContain(coupleRoom);
    expect(VALID_ROOMS).toContain(poltergeistRoom);
    expect(coupleRoom).not.toBe(poltergeistRoom);
  });
});
