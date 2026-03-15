export function createConversation(participants, room, maxTurns) {
  return {
    id: `${room}-${Date.now()}`,
    participants,
    room,
    maxTurns,
    turns: [],
    complete: false,
  };
}

export function addTurn(conversation, speaker, message) {
  const updatedTurns = [
    ...conversation.turns,
    { speaker, message, timestamp: Date.now() },
  ];
  const complete = updatedTurns.length >= conversation.maxTurns;
  return { ...conversation, turns: updatedTurns, complete };
}

export function isConversationComplete(conversation) {
  return conversation.turns.length >= conversation.maxTurns;
}

export function isNearingEnd(conversation) {
  const remaining = conversation.maxTurns - conversation.turns.length;
  return remaining <= 2;
}

export function getTurnCount(conversation, character) {
  return conversation.turns.filter((t) => t.speaker === character).length;
}
