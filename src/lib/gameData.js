import { ROOM_PROMPT_NOTES } from '../prompts/roomPrompts.js';

export const characters = [
  {
    id: 'husband',
    name: 'Elias',
    role: 'Husband',
    personality:
      'Elias is warm, practical, and eager to keep the peace. He cracks dry jokes when tense, notices when people feel left out, and tries to sound reassuring even when he is uncertain. He avoids grand speeches, prefers concrete plans, and often softens conflict with small acts of care. He is loyal to both his wife and his best friend, which sometimes makes him over-explain himself.',
  },
  {
    id: 'wife',
    name: 'Mara',
    role: 'Wife',
    personality:
      'Mara is sharp, perceptive, and emotionally honest. She reads subtext quickly, asks pointed questions, and dislikes vague answers. Her tone is confident and natural rather than formal, and she can switch from teasing to serious in a heartbeat. She values sincerity, remembers tiny details, and pushes conversations toward what people really mean instead of what sounds polite.',
  },
  {
    id: 'friend',
    name: 'Jonah',
    role: "Husband's Friend",
    personality:
      'Jonah is charismatic, restless, and a little reckless with his mouth. He likes playful banter, can turn casual topics strangely intense, and sometimes tests boundaries just to see what happens. He acts confident, but he is observant underneath the swagger and notices weak spots in a room fast. He rarely speaks formally and prefers blunt, vivid language.',
  },
];

export const rooms = [
  {
    id: 'couple-bedroom',
    name: 'Couple Bedroom',
    mood: 'private, reflective, and intimate',
    promptNote: ROOM_PROMPT_NOTES['couple-bedroom'],
  },
  {
    id: 'guest-bedroom',
    name: 'Guest Bedroom',
    mood: 'temporary, awkward, and slightly boxed in',
    promptNote: ROOM_PROMPT_NOTES['guest-bedroom'],
  },
  {
    id: 'living-room',
    name: 'Living Room',
    mood: 'casual, open, and social',
    promptNote: ROOM_PROMPT_NOTES['living-room'],
  },
  {
    id: 'sacrificial-altar',
    name: 'Sacrificial Altar',
    mood: 'wrong, ominous, and unnerving',
    promptNote: ROOM_PROMPT_NOTES['sacrificial-altar'],
  },
];

export function getCharacterById(characterId) {
  return characters.find((character) => character.id === characterId);
}

export function getRoomById(roomId) {
  return rooms.find((room) => room.id === roomId);
}
