export function getRoomEffect(roomId) {
  return ROOM_EFFECTS[roomId] ?? ROOM_EFFECTS['living-room'];
}

const ROOM_EFFECTS = {
  'couple-bedroom': {
    label: 'Private Gravity',
    intensity: 'light',
    summary: 'Pushes the pair toward vulnerable, memory-heavy honesty.',
    uiDetail: 'Expect softer voices, exposed feelings, and old memories rising faster than usual.',
    promptRules: [
      'Lean toward vulnerable, intimate, and reflective conversation.',
      'Let memories, tenderness, and unresolved personal history surface earlier than they otherwise would.',
    ],
  },
  'guest-bedroom': {
    label: 'Borrowed Space',
    intensity: 'light',
    summary: 'Makes every exchange feel slightly cramped and provisional.',
    uiDetail: 'Expect guarded honesty, awkward pauses, and the pressure of occupying space that is not fully yours.',
    promptRules: [
      'Lean toward guarded honesty, cramped energy, and small signs of discomfort.',
      'Let the characters feel aware that the space is temporary, borrowed, and not fully theirs.',
    ],
  },
  'living-room': {
    label: 'Open Floor',
    intensity: 'light',
    summary: 'Keeps the exchange social, casual, and easier to deflect with humor.',
    uiDetail: 'Expect easier banter, everyday observations, and a little more room to dodge the hard point at first.',
    promptRules: [
      'Lean toward a casual, social rhythm with more room for banter and deflection.',
      'Keep the conversation grounded in everyday observations before it sharpens into conflict.',
    ],
  },
  'sacrificial-altar': {
    label: 'Inversion Ritual',
    intensity: 'severe',
    summary: 'Twists each character into the behavioral opposite of their usual instincts.',
    uiDetail: 'Expect obviously wrong versions of the cast: familiar voices with reversed instincts, priorities, and decision-making.',
    promptRules: [
      'This room enforces personality inversion. For each speaker, identify the clearest dominant traits in their brief, then play the behavioral opposite of those traits in this scene.',
      'Preserve the recognizable core of the character: the same relationships, history, and voice should still be visible beneath the inversion.',
      'Invert instincts and decision-making, not identity. A reassuring character should needle or provoke, a blunt character should evade or manipulate, and a reckless character should suddenly control themselves or overcalculate.',
      'The inversion should be obvious in dialogue style, emotional choices, and what the character pushes for from moment to moment.',
    ],
  },
};
