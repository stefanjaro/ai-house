export function buildConversationSystemPrompt({
  characters,
  room,
  roomEffect,
  transcriptTurnCount,
  relationshipGuidance,
}) {
  return [
    'You are generating a short conversation transcript for a browser-based narrative simulation game.',
    'You may include occasional action beats inside square brackets like [glances away].',
    'Return JSON only. No markdown fences, no explanation.',
    `Return an object with one key: "turns". "turns" must be an array of exactly ${transcriptTurnCount} items.`,
    'Each turn must be an object with "speakerId" and "text".',
    'The speakers must alternate every turn, beginning with the provided startingSpeakerId.',
    'Each text value must stay under 35 words and should feel like spoken dialogue.',
    'Each line of dialogue must stay true to the speaking character: their priorities, emotional logic, word choice, confidence, and behavior must all reflect their personality.',
    'Do not flatten personality into a surface gimmick, repeated catchphrase, accent tick, or costume. The character should think and react in character, not just decorate otherwise-generic dialogue.',
    'Do not introduce, mention, or refer to people outside the house cast. Keep references limited to the three people who live in this story world unless future prompt context explicitly expands that boundary.',
    'Characters must speak with awareness of their relationships to one another, including loyalties, tensions, intimacy, familiarity, and history.',
    `Room context: ${room.name}. Mood: ${room.mood}. ${room.promptNote}`,
    `Room effect: ${roomEffect.label}. ${roomEffect.summary}`,
    'Room effect rules:',
    ...roomEffect.promptRules.map((rule) => `- ${rule}`),
    `Relationship context: ${relationshipGuidance}`,
    'Character briefs:',
    ...characters.map(
      (character) => `- ${character.id} (${character.name}, ${character.role}): ${character.personality}`,
    ),
  ].join('\n');
}

export function buildConversationTurnSystemPrompt({
  characters,
  room,
  roomEffect,
  transcriptTurnCount,
  relationshipGuidance,
  turnNumber,
  expectedSpeakerId,
  historyLines,
}) {
  return [
    'You are generating exactly one turn of dialogue for a browser-based narrative simulation game.',
    'You may include occasional action beats inside square brackets like [glances away].',
    'Return JSON only. No markdown fences, no explanation.',
    'Return an object with exactly two keys: "speakerId" and "text".',
    `This is turn ${turnNumber} of ${transcriptTurnCount}.`,
    `The speaker for this turn must be "${expectedSpeakerId}".`,
    'The text must stay under 35 words and should feel like spoken dialogue.',
    'Each line of dialogue must stay true to the speaking character: their priorities, emotional logic, word choice, confidence, and behavior must all reflect their personality.',
    'Do not reduce personality to a gimmick, repeated catchphrase, accent tick, or costume. The character should think and react in character, not just decorate otherwise-generic dialogue.',
    'Do not introduce, mention, or refer to people outside the house cast. Keep references limited to the three people who live in this story world unless future prompt context explicitly expands that boundary.',
    'Characters must speak with awareness of their relationships to one another, including loyalties, tensions, intimacy, familiarity, and history.',
    `Room context: ${room.name}. Mood: ${room.mood}. ${room.promptNote}`,
    `Room effect: ${roomEffect.label}. ${roomEffect.summary}`,
    'Room effect rules:',
    ...roomEffect.promptRules.map((rule) => `- ${rule}`),
    `Relationship context: ${relationshipGuidance}`,
    'Character briefs:',
    ...characters.map(
      (character) => `- ${character.id} (${character.name}, ${character.role}): ${character.personality}`,
    ),
    'Prior turns:',
    historyLines,
  ].join('\n');
}
