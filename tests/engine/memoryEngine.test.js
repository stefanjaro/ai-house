import { describe, it, expect } from 'vitest';
import {
  getMemoryItems,
  applyMemoryUpdate,
  formatMemoryFile,
  isAtCapacity,
} from '../../src/engine/memoryEngine.js';

describe('getMemoryItems', () => {
  it('parses a multi-line string into an array of items', () => {
    const text = 'We argued about the harvest\nShe laughed at my joke\nI felt unheard today\n';
    expect(getMemoryItems(text)).toEqual([
      'We argued about the harvest',
      'She laughed at my joke',
      'I felt unheard today',
    ]);
  });

  it('strips empty lines', () => {
    const text = 'First item\n\nSecond item\n\n';
    expect(getMemoryItems(text)).toEqual(['First item', 'Second item']);
  });

  it('returns an empty array for an empty or whitespace-only string', () => {
    expect(getMemoryItems('')).toEqual([]);
    expect(getMemoryItems('\n\n\n')).toEqual([]);
  });
});

describe('applyMemoryUpdate', () => {
  it('adds new items when below capacity', () => {
    const current = ['Old memory one', 'Old memory two'];
    const result = applyMemoryUpdate(current, ['New memory'], [], 20);
    expect(result).toContain('Old memory one');
    expect(result).toContain('New memory');
    expect(result.length).toBe(3);
  });

  it('removes discarded items and adds new ones', () => {
    const current = ['Keep this', 'Discard this', 'Keep this too'];
    const result = applyMemoryUpdate(current, ['New item'], ['Discard this'], 20);
    expect(result).toContain('Keep this');
    expect(result).toContain('Keep this too');
    expect(result).toContain('New item');
    expect(result).not.toContain('Discard this');
  });

  it('throws when the result would exceed maxItems', () => {
    const current = ['A', 'B', 'C', 'D', 'E'];
    // No discards, adding 1 would make 6, which exceeds maxItems of 5
    expect(() => applyMemoryUpdate(current, ['F'], [], 5)).toThrow();
  });

  it('does not throw when result equals maxItems exactly', () => {
    const current = ['A', 'B', 'C', 'D'];
    expect(() => applyMemoryUpdate(current, ['E'], [], 5)).not.toThrow();
  });
});

describe('formatMemoryFile', () => {
  it('joins items with newlines', () => {
    const items = ['First memory', 'Second memory', 'Third memory'];
    const result = formatMemoryFile(items);
    expect(result).toBe('First memory\nSecond memory\nThird memory\n');
  });

  it('returns an empty string for an empty array', () => {
    expect(formatMemoryFile([])).toBe('');
  });
});

describe('isAtCapacity', () => {
  it('returns false when below max', () => {
    expect(isAtCapacity(['A', 'B'], 5)).toBe(false);
  });

  it('returns true when at max', () => {
    expect(isAtCapacity(['A', 'B', 'C', 'D', 'E'], 5)).toBe(true);
  });

  it('returns true when above max', () => {
    expect(isAtCapacity(['A', 'B', 'C', 'D', 'E', 'F'], 5)).toBe(true);
  });
});
