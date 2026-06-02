import { ROOM_EFFECT_PROMPT_RULES } from '../prompts/roomPrompts.js';

export function getRoomEffect(roomId) {
  return ROOM_EFFECTS[roomId] ?? ROOM_EFFECTS['living-room'];
}

const ROOM_EFFECTS = {
  'couple-bedroom': {
    label: 'Pajama Zone',
    intensity: 'light',
    summary: 'Makes people comfy enough to overshare and say the weird honest part out loud.',
    uiDetail: 'Expect sleepy honesty, tiny personal details, and sudden emotional nonsense.',
    promptRules: ROOM_EFFECT_PROMPT_RULES['couple-bedroom'],
  },
  'guest-bedroom': {
    label: 'Weird Guest Energy',
    intensity: 'light',
    summary: 'Makes every exchange feel cramped, temporary, and one bad comment away from trouble.',
    uiDetail: 'Expect awkward pauses, side-eye, and little comments that land harder than they should.',
    promptRules: ROOM_EFFECT_PROMPT_RULES['guest-bedroom'],
  },
  'living-room': {
    label: 'Couch Goblin Mode',
    intensity: 'light',
    summary: 'Keeps the exchange loose, social, and dangerously ready for stupid bits.',
    uiDetail: 'Expect banter, distractions, fake innocence, and delayed seriousness.',
    promptRules: ROOM_EFFECT_PROMPT_RULES['living-room'],
  },
  'sacrificial-altar': {
    label: 'Backwards Brain Blast',
    intensity: 'severe',
    summary: 'Turns everybody into a backwards version of themselves, like a cursed joke landed too hard.',
    uiDetail: 'Expect familiar people with flipped instincts, weird priorities, and dramatic cursed-energy nonsense.',
    promptRules: ROOM_EFFECT_PROMPT_RULES['sacrificial-altar'],
  },
};
