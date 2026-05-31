import { validateTopic } from './topic.js';
import { TRANSCRIPT_TURN_COUNT } from './transcript.js';

export function buildConversationRequest({
  characters,
  room,
  startingSpeakerId,
  topic,
  model = 'gpt-5.4-nano',
}) {
  const topicCheck = validateTopic(topic);
  if (!topicCheck.ok) {
    throw new Error(topicCheck.error);
  }

  if (!Array.isArray(characters) || characters.length !== 2) {
    throw new Error('Exactly two characters are required.');
  }

  if (!characters.some((character) => character.id === startingSpeakerId)) {
    throw new Error('The starting speaker must be one of the selected characters.');
  }

  const systemContent = [
    'You are generating a short conversation transcript for a browser-based narrative simulation game.',
    'Write natural, casual English. Avoid formal language unless a personality clearly demands it.',
    'You may include occasional action beats inside square brackets like [glances away].',
    'Return JSON only. No markdown fences, no explanation.',
    `Return an object with one key: "turns". "turns" must be an array of exactly ${TRANSCRIPT_TURN_COUNT} items.`,
    'Each turn must be an object with "speakerId" and "text".',
    'The speakers must alternate every turn, beginning with the provided startingSpeakerId.',
    'Each text value must stay under 35 words and should feel like spoken dialogue.',
    `Room context: ${room.name}. Mood: ${room.mood}. ${room.promptNote}`,
    'Character briefs:',
    ...characters.map(
      (character) => `- ${character.id} (${character.name}, ${character.role}): ${character.personality}`,
    ),
  ].join('\n');

  const userContent = JSON.stringify(
    {
      topic: topicCheck.normalizedTopic,
      startingSpeakerId,
      selectedCharacters: characters.map(({ id, name, role }) => ({ id, name, role })),
      room: {
        id: room.id,
        name: room.name,
        mood: room.mood,
      },
    },
    null,
    2,
  );

  return {
    model,
    input: [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
    temperature: 1,
    max_output_tokens: 500,
  };
}

export function extractTranscriptFromOutput(outputText) {
  const normalized = outputText.trim();
  const codeFenceMatch = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = codeFenceMatch ? codeFenceMatch[1].trim() : normalized;
  const turns = parseTranscriptTurns(candidate);

  if (!Array.isArray(turns) || turns.length === 0) {
    throw new Error('The provider response did not include a valid transcript.');
  }

  return turns.map((turn) => ({
    speakerId: String(turn.speakerId),
    text: String(turn.text).trim(),
  }));
}

function parseTranscriptTurns(candidate) {
  try {
    const parsed = JSON.parse(candidate);
    return Array.isArray(parsed) ? parsed : parsed.turns;
  } catch {
    return parseTurnsLeniently(candidate);
  }
}

function parseTurnsLeniently(candidate) {
  const turns = [];
  let cursor = 0;

  while (true) {
    const speakerKeyIndex = candidate.indexOf('"speakerId"', cursor);
    if (speakerKeyIndex === -1) {
      break;
    }

    const speakerValueStart = findValueQuote(candidate, speakerKeyIndex);
    const speakerValue = readStrictString(candidate, speakerValueStart);
    const textKeyIndex = candidate.indexOf('"text"', speakerValue.endIndex);

    if (textKeyIndex === -1) {
      break;
    }

    const textValueStart = findValueQuote(candidate, textKeyIndex);
    const textValue = readRelaxedTextString(candidate, textValueStart);

    turns.push({
      speakerId: speakerValue.value,
      text: textValue.value,
    });

    cursor = textValue.endIndex;
  }

  return turns;
}

function findValueQuote(source, keyIndex) {
  const colonIndex = source.indexOf(':', keyIndex);
  return source.indexOf('"', colonIndex);
}

function readStrictString(source, quoteIndex) {
  let value = '';
  let cursor = quoteIndex + 1;

  while (cursor < source.length) {
    const character = source[cursor];
    if (character === '\\') {
      value += source[cursor + 1] ?? '';
      cursor += 2;
      continue;
    }

    if (character === '"') {
      return { value, endIndex: cursor + 1 };
    }

    value += character;
    cursor += 1;
  }

  return { value, endIndex: cursor };
}

function readRelaxedTextString(source, quoteIndex) {
  let value = '';
  let cursor = quoteIndex + 1;

  while (cursor < source.length) {
    const character = source[cursor];
    if (character === '\\') {
      value += source[cursor + 1] ?? '';
      cursor += 2;
      continue;
    }

    if (character === '"' && closesTextField(source, cursor)) {
      return { value, endIndex: cursor + 1 };
    }

    value += character;
    cursor += 1;
  }

  return { value, endIndex: cursor };
}

function closesTextField(source, quoteIndex) {
  let cursor = quoteIndex + 1;

  while (cursor < source.length && /\s/.test(source[cursor])) {
    cursor += 1;
  }

  return source[cursor] === '}';
}
