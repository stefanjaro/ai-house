import { describe, expect, it } from 'vitest';
import { countWords, validateTopic } from '../src/lib/topic.js';

describe('topic validation', () => {
  it('counts normalized words', () => {
    expect(countWords('  one   two\nthree ')).toBe(3);
  });

  it('accepts a 25-word topic', () => {
    const topic = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twentyone twentytwo twentythree twentyfour twentyfive';
    expect(validateTopic(topic)).toMatchObject({
      ok: true,
      wordCount: 25,
    });
  });

  it('rejects a topic above the 25-word limit', () => {
    const result = validateTopic(
      'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twentyone twentytwo twentythree twentyfour twentyfive twentysix',
    );

    expect(result.ok).toBe(false);
    expect(result.error).toContain('25 words or fewer');
  });
});
