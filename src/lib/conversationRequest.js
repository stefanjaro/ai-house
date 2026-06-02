import { validateTopic } from './topic.js';
import { getRoomEffect } from './roomEffects.js';
import { TRANSCRIPT_TURN_COUNT } from './transcript.js';
import {
  buildConversationSystemPrompt,
  buildConversationTurnSystemPrompt,
} from '../prompts/conversationPrompts.js';

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

  const roomEffect = getRoomEffect(room.id);

  const systemContent = buildConversationSystemPrompt({
    characters,
    room,
    roomEffect,
    transcriptTurnCount: TRANSCRIPT_TURN_COUNT,
    relationshipGuidance: buildRelationshipGuidance(characters),
  });

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

export function buildConversationTurnRequest({
  characters,
  room,
  startingSpeakerId,
  topic,
  transcriptSoFar = [],
  turnNumber,
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

  if (!Number.isInteger(turnNumber) || turnNumber < 1 || turnNumber > TRANSCRIPT_TURN_COUNT) {
    throw new Error(`Turn number must be between 1 and ${TRANSCRIPT_TURN_COUNT}.`);
  }

  const expectedSpeakerId = turnNumber % 2 === 1
    ? startingSpeakerId
    : characters.find((character) => character.id !== startingSpeakerId)?.id;

  const historyLines = transcriptSoFar.length
    ? transcriptSoFar.map((turn, index) => `${index + 1}. ${turn.speakerId}: ${turn.text}`).join('\n')
    : 'No prior turns.';
  const roomEffect = getRoomEffect(room.id);

  const systemContent = buildConversationTurnSystemPrompt({
    characters,
    room,
    roomEffect,
    transcriptTurnCount: TRANSCRIPT_TURN_COUNT,
    relationshipGuidance: buildRelationshipGuidance(characters),
    turnNumber,
    expectedSpeakerId,
    historyLines,
  });

  const userContent = JSON.stringify(
    {
      topic: topicCheck.normalizedTopic,
      turnNumber,
      expectedSpeakerId,
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
    max_output_tokens: 120,
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

export function extractTurnFromOutput(outputText) {
  const normalized = outputText.trim();
  const codeFenceMatch = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = codeFenceMatch ? codeFenceMatch[1].trim() : normalized;

  try {
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed?.turns) && parsed.turns[0]) {
      return normalizeTurn(parsed.turns[0]);
    }

    if (parsed?.turn) {
      return normalizeTurn(parsed.turn);
    }

    return normalizeTurn(parsed);
  } catch {
    const turns = parseTurnsLeniently(candidate);
    if (!turns[0]) {
      throw new Error('The provider response did not include a valid turn.');
    }

    return normalizeTurn(turns[0]);
  }
}

function parseTranscriptTurns(candidate) {
  try {
    const parsed = JSON.parse(candidate);
    return Array.isArray(parsed) ? parsed : parsed.turns;
  } catch {
    return parseTurnsLeniently(candidate);
  }
}

function normalizeTurn(turn) {
  if (!turn || typeof turn !== 'object') {
    throw new Error('The provider response did not include a valid turn.');
  }

  return {
    speakerId: String(turn.speakerId),
    text: String(turn.text).trim(),
  };
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

function buildRelationshipGuidance(characters) {
  const characterIds = new Set(characters.map((character) => character.id));
  const relationshipLines = [];

  if (characterIds.has('husband') && characterIds.has('wife')) {
    relationshipLines.push('Elias and Mara are married, intimate, and close enough to notice small shifts in each other quickly.');
  }

  if (characterIds.has('husband') && characterIds.has('friend')) {
    relationshipLines.push("Jonah is Elias's longtime friend, so they know each other's habits, weak spots, and old loyalties.");
  }

  if (characterIds.has('wife') && characterIds.has('friend')) {
    relationshipLines.push("Mara and Jonah are connected through Elias, so their familiarity carries both observation and caution.");
  }

  return relationshipLines.join(' ');
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
