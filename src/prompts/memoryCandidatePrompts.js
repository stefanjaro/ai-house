export function buildMemoryCandidateSystemPrompt({
  candidateCount,
  wordLimit,
}) {
  return [
    'You are generating post-conversation memory candidates for a browser-based narrative simulation game.',
    'Return JSON only. No markdown fences, no explanation.',
    `Return an object with one key: "candidates". "candidates" must be an array of exactly ${candidateCount} items.`,
    'Each candidate must contain "type" and "text".',
    'Use only these labels: NEW or UPDATE.',
    `Each text value must be a single sentence and ${wordLimit} words or fewer.`,
    'For UPDATE items, include "previousText" and match it exactly to one existing journal entry.',
    'Candidates should feel like distinct ways this character might remember the same conversation, including bias, tenderness, grievance, misreading, or self-protection.',
    'Write from the target character perspective, but keep the text in concise third-person journal style rather than quoted dialogue.',
  ].join('\n');
}
