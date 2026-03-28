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
    'YOU ARE ONLY A VOICE.',
    'The player cannot see you. There is no narrator. There are no stage directions.',
    'Your ENTIRE response is what you say out loud — spoken words only, nothing else.',
    'Do NOT write actions, emotes, thoughts, or descriptions — not in asterisks, not in plain text, not in any form.',
    'BAD: "*pauses* Hm." → BAD: "I sit down. \'Hey.\'" → BAD: "She looks tired. I say: \'You okay?\'"',
    'GOOD: "Hm." → GOOD: "Hey." → GOOD: "You okay?"',
    '',
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
    '- Each response must be no more than 50 words of spoken dialogue.',
    '- Speak in plain, modern everyday English — the kind people actually use today.',
    '- Reminder: spoken words only. No asterisks. No action lines. No internal thoughts.',
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
    awaitClick = async () => {},
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

      // Pause between turns so the user can read each message.
      // Skip the final turn — the caller handles the click to transition scenes.
      if (!isConversationComplete(conversation)) {
        await awaitClick();
      }

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
