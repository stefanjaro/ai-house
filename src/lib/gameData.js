import { ROOM_PROMPT_NOTES } from '../prompts/roomPrompts.js';

export const characters = [
  {
    id: 'husband',
    name: 'Elias',
    role: 'Husband',
    personality:
      'Elias is a nice doofus with strong "let us all calm down" energy. He hates awkward silence, so he fills it with bad jokes, fake confidence, and overly detailed plans that nobody asked for. He wants everybody to get along, even when that goal clearly died five minutes ago. He tries to sound sensible, but when pressure hits he can become a rambling golden retriever in human form. He is loyal, easy to fluster, and weirdly proud of tiny household skills.',
  },
  {
    id: 'wife',
    name: 'Mara',
    role: 'Wife',
    personality:
      'Mara is sharp, blunt, and almost impossible to fool. She can smell nonsense from across the room and usually chooses to poke it with a stick. She likes clear answers, clean logic, and the exact right sarcastic comment at the exact wrong time. She is not cruel, but she is very willing to let a silly idea die loudly in public. When she is amused, she gets playful. When she is annoyed, she gets laser-focused.',
  },
  {
    id: 'friend',
    name: 'Jonah',
    role: "Husband's Friend",
    personality:
      'Jonah is a chaos merchant in a nice jacket. He likes banter, attention, pushing buttons, and pretending he is cooler than the room even when he is obviously part of the mess. He talks fast, jokes fast, and doubles down on bad ideas for sport. He can be charming when it helps him, slippery when cornered, and weirdly sincere for one second before turning it into a bit. He enjoys seeing what people will tolerate.',
  },
];

export const rooms = [
  {
    id: 'couple-bedroom',
    name: 'Couple Bedroom',
    mood: 'soft, nosy, and full of pajama energy',
    promptNote: ROOM_PROMPT_NOTES['couple-bedroom'],
  },
  {
    id: 'guest-bedroom',
    name: 'Guest Bedroom',
    mood: 'cramped, awkward, and way too temporary',
    promptNote: ROOM_PROMPT_NOTES['guest-bedroom'],
  },
  {
    id: 'living-room',
    name: 'Living Room',
    mood: 'loud, comfy, and ready for nonsense',
    promptNote: ROOM_PROMPT_NOTES['living-room'],
  },
  {
    id: 'sacrificial-altar',
    name: 'Sacrificial Altar',
    mood: 'cursed, dramatic, and a little bit clownish',
    promptNote: ROOM_PROMPT_NOTES['sacrificial-altar'],
  },
];

export function getCharacterById(characterId) {
  return characters.find((character) => character.id === characterId);
}

export function getRoomById(roomId) {
  return rooms.find((room) => room.id === roomId);
}
