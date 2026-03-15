import { describe, it, expect } from 'vitest';
import {
  createConversation,
  addTurn,
  isConversationComplete,
  getTurnCount,
  isNearingEnd,
} from '../../src/engine/conversationEngine.js';

describe('createConversation', () => {
  it('returns a correctly shaped conversation object', () => {
    const conv = createConversation(['husband', 'wife'], 'bedroom', 20);
    expect(conv.participants).toEqual(['husband', 'wife']);
    expect(conv.room).toBe('bedroom');
    expect(conv.maxTurns).toBe(20);
    expect(conv.turns).toEqual([]);
    expect(conv.complete).toBe(false);
    expect(conv.id).toBeTruthy();
  });
});

describe('addTurn', () => {
  it('increments total turn count', () => {
    let conv = createConversation(['husband', 'wife'], 'bedroom', 20);
    conv = addTurn(conv, 'husband', 'Good morning.');
    expect(conv.turns.length).toBe(1);
    conv = addTurn(conv, 'wife', 'Good morning to you.');
    expect(conv.turns.length).toBe(2);
  });

  it('records speaker, message, and timestamp', () => {
    let conv = createConversation(['husband', 'wife'], 'bedroom', 20);
    conv = addTurn(conv, 'husband', 'Good morning.');
    expect(conv.turns[0].speaker).toBe('husband');
    expect(conv.turns[0].message).toBe('Good morning.');
    expect(conv.turns[0].timestamp).toBeTypeOf('number');
  });

  it('does not mutate the original conversation', () => {
    const conv = createConversation(['husband', 'wife'], 'bedroom', 20);
    const updated = addTurn(conv, 'husband', 'Hello.');
    expect(conv.turns.length).toBe(0);
    expect(updated.turns.length).toBe(1);
  });
});

describe('isConversationComplete', () => {
  it('returns false before max turns are reached', () => {
    let conv = createConversation(['husband', 'wife'], 'bedroom', 4);
    conv = addTurn(conv, 'husband', 'A');
    conv = addTurn(conv, 'wife', 'B');
    expect(isConversationComplete(conv)).toBe(false);
  });

  it('returns true when max turns are reached', () => {
    let conv = createConversation(['husband', 'wife'], 'bedroom', 4);
    conv = addTurn(conv, 'husband', 'A');
    conv = addTurn(conv, 'wife', 'B');
    conv = addTurn(conv, 'husband', 'C');
    conv = addTurn(conv, 'wife', 'D');
    expect(isConversationComplete(conv)).toBe(true);
  });
});

describe('isNearingEnd', () => {
  it('returns false when far from the turn limit', () => {
    let conv = createConversation(['husband', 'wife'], 'bedroom', 20);
    conv = addTurn(conv, 'husband', 'A');
    expect(isNearingEnd(conv)).toBe(false);
  });

  it('returns true when exactly 2 turns remain', () => {
    let conv = createConversation(['husband', 'wife'], 'bedroom', 4);
    conv = addTurn(conv, 'husband', 'A');
    conv = addTurn(conv, 'wife', 'B');
    // 2 turns taken, 2 remain
    expect(isNearingEnd(conv)).toBe(true);
  });

  it('returns true when 1 turn remains', () => {
    let conv = createConversation(['husband', 'wife'], 'bedroom', 4);
    conv = addTurn(conv, 'husband', 'A');
    conv = addTurn(conv, 'wife', 'B');
    conv = addTurn(conv, 'husband', 'C');
    // 3 turns taken, 1 remains
    expect(isNearingEnd(conv)).toBe(true);
  });

  it('returns false when more than 2 turns remain', () => {
    let conv = createConversation(['husband', 'wife'], 'bedroom', 10);
    conv = addTurn(conv, 'husband', 'A');
    // 1 taken, 9 remain
    expect(isNearingEnd(conv)).toBe(false);
  });
});

describe('getTurnCount', () => {
  it('tracks turns per character independently', () => {
    let conv = createConversation(['husband', 'wife'], 'bedroom', 20);
    conv = addTurn(conv, 'husband', 'A');
    conv = addTurn(conv, 'wife', 'B');
    conv = addTurn(conv, 'husband', 'C');
    expect(getTurnCount(conv, 'husband')).toBe(2);
    expect(getTurnCount(conv, 'wife')).toBe(1);
  });

  it('returns 0 for a character who has not spoken', () => {
    const conv = createConversation(['husband', 'wife'], 'bedroom', 20);
    expect(getTurnCount(conv, 'husband')).toBe(0);
  });
});
