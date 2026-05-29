const MAX_TOPIC_WORDS = 25;

export function countWords(text) {
  const normalized = text.trim();
  if (!normalized) {
    return 0;
  }

  return normalized.split(/\s+/).length;
}

export function validateTopic(topic) {
  const normalizedTopic = topic.trim().replace(/\s+/g, ' ');
  const wordCount = countWords(normalizedTopic);

  if (!normalizedTopic) {
    return {
      ok: false,
      error: 'Enter a topic before starting the conversation.',
      normalizedTopic,
      wordCount,
    };
  }

  if (wordCount > MAX_TOPIC_WORDS) {
    return {
      ok: false,
      error: `Keep the topic to ${MAX_TOPIC_WORDS} words or fewer.`,
      normalizedTopic,
      wordCount,
    };
  }

  return {
    ok: true,
    error: null,
    normalizedTopic,
    wordCount,
  };
}

export { MAX_TOPIC_WORDS };
