import { ROOM_EFFECT_PROMPT_RULES } from '../prompts/roomPrompts.js';

export function getRoomEffect(roomId) {
  return ROOM_EFFECTS[roomId] ?? ROOM_EFFECTS['living-room'];
}

const ROOM_EFFECTS = {
  'couple-bedroom': {
    label: 'Private Gravity',
    intensity: 'light',
    summary: 'Pushes the pair toward vulnerable, memory-heavy honesty.',
    uiDetail: 'Expect softer voices, exposed feelings, and old memories rising faster than usual.',
    promptRules: ROOM_EFFECT_PROMPT_RULES['couple-bedroom'],
  },
  'guest-bedroom': {
    label: 'Borrowed Space',
    intensity: 'light',
    summary: 'Makes every exchange feel slightly cramped and provisional.',
    uiDetail: 'Expect guarded honesty, awkward pauses, and the pressure of occupying space that is not fully yours.',
    promptRules: ROOM_EFFECT_PROMPT_RULES['guest-bedroom'],
  },
  'living-room': {
    label: 'Open Floor',
    intensity: 'light',
    summary: 'Keeps the exchange social, casual, and easier to deflect with humor.',
    uiDetail: 'Expect easier banter, everyday observations, and a little more room to dodge the hard point at first.',
    promptRules: ROOM_EFFECT_PROMPT_RULES['living-room'],
  },
  'sacrificial-altar': {
    label: 'Inversion Ritual',
    intensity: 'severe',
    summary: 'Twists each character into the behavioral opposite of their usual instincts.',
    uiDetail: 'Expect obviously wrong versions of the cast: familiar voices with reversed instincts, priorities, and decision-making.',
    promptRules: ROOM_EFFECT_PROMPT_RULES['sacrificial-altar'],
  },
};
