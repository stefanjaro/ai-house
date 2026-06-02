const MEMORY_CANDIDATE_COUNT = 5;
const MEMORY_CANDIDATE_MIN_VISIBLE = 3;
const MEMORY_CANDIDATE_MAX_VISIBLE = 5;
const MEMORY_CANDIDATE_WORD_LIMIT = 15;

export function buildMemoryCandidateRequest({
  character,
  otherCharacter,
  room,
  topic,
  transcript,
  existingJournal,
  model = 'gpt-5.4-nano',
}) {
  const systemContent = [
    'You are generating post-conversation memory candidates for a browser-based narrative simulation game.',
    'Return JSON only. No markdown fences, no explanation.',
    `Return an object with one key: "candidates". "candidates" must be an array of exactly ${MEMORY_CANDIDATE_COUNT} items.`,
    'Each candidate must contain "type" and "text".',
    'Use only these labels: NEW or UPDATE.',
    `Each text value must be a single sentence and ${MEMORY_CANDIDATE_WORD_LIMIT} words or fewer.`,
    'For UPDATE items, include "previousText" and match it exactly to one existing journal entry.',
    'Candidates should feel like distinct ways this character might remember the same conversation, including bias, tenderness, grievance, misreading, or self-protection.',
    'Write from the target character perspective, but keep the text in concise third-person journal style rather than quoted dialogue.',
  ].join('\n');

  const userContent = JSON.stringify(
    {
      characterId: character.id,
      characterName: character.name,
      characterRole: character.role,
      characterPersonality: character.personality,
      otherCharacter: {
        id: otherCharacter.id,
        name: otherCharacter.name,
        role: otherCharacter.role,
      },
      topic,
      room: {
        id: room.id,
        name: room.name,
        mood: room.mood,
      },
      existingJournal,
      transcript,
    },
    null,
    2,
  );

  return {
    model,
    input: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userContent },
    ],
    temperature: 1,
    max_output_tokens: 250,
  };
}

export function extractMemoryCandidatesFromOutput(outputText, options = {}) {
  const normalized = outputText.trim();
  const codeFenceMatch = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = codeFenceMatch ? codeFenceMatch[1].trim() : normalized;
  const parsedCandidates = parseCandidateArray(candidate);

  if (!parsedCandidates.length) {
    throw new Error('The provider response did not include valid memory candidates.');
  }

  const repairedCandidates = [];

  for (const entry of parsedCandidates) {
    const normalizedCandidate = normalizeCandidate(entry, options.existingJournal ?? []);
    if (normalizedCandidate) {
      repairedCandidates.push(normalizedCandidate);
    }
  }

  if (!repairedCandidates.length) {
    throw new Error('The provider response did not include valid memory candidates.');
  }

  return repairedCandidates;
}

export function pickVisibleMemoryCandidates(
  candidates,
  {
    minVisible = MEMORY_CANDIDATE_MIN_VISIBLE,
    maxVisible = MEMORY_CANDIDATE_MAX_VISIBLE,
    randomValue = Math.random(),
  } = {},
) {
  const span = Math.max(0, maxVisible - minVisible);
  const requestedCount = minVisible + Math.min(span, Math.floor(randomValue * (span + 1)));
  return candidates.slice(0, Math.min(candidates.length, requestedCount));
}

function parseCandidateArray(candidate) {
  const parsed = JSON.parse(candidate);
  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (Array.isArray(parsed?.candidates)) {
    return parsed.candidates;
  }

  return [];
}

function normalizeCandidate(candidate, existingJournal) {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const type = normalizeType(candidate.type, candidate.previousText);
  const text = normalizeSentence(candidate.text);
  if (!text) {
    return null;
  }

  const previousText = type === 'UPDATE'
    ? findMatchingJournalEntry(candidate.previousText, existingJournal)
    : '';

  return {
    type: type === 'UPDATE' && previousText ? 'UPDATE' : 'NEW',
    text,
    previousText,
  };
}

function normalizeType(type, previousText) {
  const normalized = String(type ?? '').trim().toUpperCase();

  if (normalized.includes('UPDATE')) {
    return 'UPDATE';
  }

  if (normalized.includes('NEW')) {
    return 'NEW';
  }

  return previousText ? 'UPDATE' : 'NEW';
}

function normalizeSentence(text) {
  const collapsed = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!collapsed) {
    return '';
  }

  const firstSentence = extractFirstSentence(collapsed);
  return truncateSentence(firstSentence, MEMORY_CANDIDATE_WORD_LIMIT);
}

function extractFirstSentence(text) {
  const sentenceMatch = text.match(/^.*?[.!?](?=(?:\s|$|["')\]])|$)/);
  return sentenceMatch ? sentenceMatch[0].trim() : text;
}

function truncateSentence(text, wordLimit) {
  const words = text.match(/\S+/g) ?? [];
  const truncated = words.slice(0, wordLimit).join(' ');

  if (!truncated) {
    return '';
  }

  return /[.!?]$/.test(truncated) ? truncated : `${truncated}.`;
}

function findMatchingJournalEntry(previousText, existingJournal) {
  const normalizedPreviousText = String(previousText ?? '').replace(/\s+/g, ' ').trim();
  if (!normalizedPreviousText) {
    return '';
  }

  return existingJournal.find((entry) => entry === normalizedPreviousText) ?? '';
}
