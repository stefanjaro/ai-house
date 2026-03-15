import { llmService } from './llmService.js';
import { fileService } from './fileService.js';
import {
  createConversation,
  addTurn,
  isConversationComplete,
  isNearingEnd,
} from '../engine/conversationEngine.js';

function buildSystemPrompt(character, { personalities, memories, roomInfluence, maxTurns, conversation }) {
  const personality = personalities[character] ?? '';
  const memory = memories[character] ?? '';
  const remaining = maxTurns - conversation.turns.length;
  const nearingEnd = isNearingEnd(conversation);

  return [
    personality,
    '',
    'MEMORY:',
    memory || '(No memories yet.)',
    '',
    'ROOM CONTEXT:',
    roomInfluence,
    '',
    'CONVERSATION RULES:',
    `- This conversation has a maximum of ${maxTurns} total turns (${maxTurns / 2} per character).`,
    '- Each response must be no more than 50 words.',
    '- Speak in plain modern-day conversational English. Do not use archaic, medieval, or formal language.',
    '- Do NOT write your internal thoughts or feelings. Only speak out loud and describe visible actions.',
    '- You may use *asterisks* only for physical actions the other person can see (e.g. *smiles*, *sits down*). Never use asterisks for thoughts, feelings, or anything internal.',
    nearingEnd
      ? `- You have only ${remaining} turn${remaining === 1 ? '' : 's'} remaining. Begin wrapping up the conversation naturally.`
      : '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function buildMessageHistory(conversation, currentSpeaker) {
  return conversation.turns.map((turn) => ({
    role: turn.speaker === currentSpeaker ? 'assistant' : 'user',
    content: turn.message,
  }));
}

function formatTranscript(conversation, participantNames) {
  const header = [
    `Room: ${conversation.room}`,
    `Participants: ${conversation.participants.map((p) => participantNames[p] ?? p).join(', ')}`,
    '─'.repeat(40),
  ].join('\n');

  const body = conversation.turns
    .map((t) => `${participantNames[t.speaker] ?? t.speaker}: ${t.message}`)
    .join('\n\n');

  return `${header}\n\n${body}`;
}

export const conversationOrchestrator = {
  async runConversation({
    participants,
    room,
    config,
    personalities,
    memories,
    roomInfluence,
    maxTurns,
    day,
    logType,
    onTurnStart = () => {},
    onChunk = () => {},
    onTurnComplete = () => {},
    onConversationComplete = () => {},
  }) {
    let conversation = createConversation(participants, room, maxTurns);
    let turnIndex = 0;

    while (!isConversationComplete(conversation)) {
      const speaker = participants[turnIndex % participants.length];
      const characterConfig = config[speaker];

      const systemPrompt = buildSystemPrompt(speaker, {
        personalities,
        memories,
        roomInfluence,
        maxTurns,
        conversation,
      });

      const history = buildMessageHistory(conversation, speaker);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        ...(history.length === 0
          ? [{ role: 'user', content: `Begin the conversation in the ${room}.` }]
          : []),
      ];

      onTurnStart(speaker);

      let fullText = '';
      await llmService.streamCompletion({
        endpoint: characterConfig.endpoint,
        apiKey: characterConfig.apiKey,
        model: characterConfig.model,
        messages,
        onChunk: (chunk) => {
          onChunk(speaker, chunk);
          fullText += chunk;
        },
        onComplete: (text) => {
          fullText = text;
        },
      });

      conversation = addTurn(conversation, speaker, fullText);
      onTurnComplete(speaker, fullText);
      turnIndex++;
    }

    const participantNames = Object.fromEntries(
      Object.entries(config).map(([key, val]) => [key, val.name ?? key])
    );
    const transcript = formatTranscript(conversation, participantNames);

    await fileService.saveConversationLog(logType, day, transcript);
    onConversationComplete(transcript);

    return transcript;
  },
};
