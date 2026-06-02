export function buildMemoryCandidateSystemPrompt({
  candidateCount,
  wordLimit,
}) {
  return [
    'You are generating post-conversation memory candidates for a goofy apartment game.',
    'Return JSON only. No markdown fences, no explanation.',
    `Return an object with one key: "candidates". "candidates" must be an array of exactly ${candidateCount} items.`,
    'Each candidate must contain "type" and "text".',
    'Use only these labels: NEW or UPDATE.',
    `Each text value must be a single sentence and ${wordLimit} words or fewer.`,
    'For UPDATE items, include "previousText" and match it exactly to one existing journal entry.',
    'Keep it simple. No fancy writing.',
    'Make the memories feel biased, petty, wrong, dramatic, defensive, affectionate, or hilariously off.',
    'The same conversation should produce clearly different spins, not five repeats.',
    'Write from the target character perspective, but keep the text as short third-person journal style, not quoted dialogue.',
  ].join('\n');
}
