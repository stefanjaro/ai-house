export const BLOCKED_RULES = [
  { characterId: 'poltergeist', roomId: 'bedroom' },
  { characterId: 'husband',     roomId: 'mystery_room' },
  { characterId: 'wife',        roomId: 'mystery_room' },
];

export function canEnter(characterId, roomId) {
  return !BLOCKED_RULES.some(r => r.characterId === characterId && r.roomId === roomId);
}
