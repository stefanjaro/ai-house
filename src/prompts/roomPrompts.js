export const ROOM_PROMPT_NOTES = {
  'couple-bedroom': 'The bedroom encourages vulnerable, reflective conversation and memory-heavy tangents.',
  'guest-bedroom': 'The guest bedroom encourages guarded honesty, cramped energy, and the feeling of borrowed space.',
  'living-room': 'The living room encourages relaxed conversation, joking, and everyday observations.',
  'sacrificial-altar': 'The altar room feels infernal and unsettling. It should make familiar people sound wrong, reversed, and unnervingly unlike themselves.',
};

export const ROOM_EFFECT_PROMPT_RULES = {
  'couple-bedroom': [
    'Lean toward vulnerable, intimate, and reflective conversation.',
    'Let memories, tenderness, and unresolved personal history surface earlier than they otherwise would.',
  ],
  'guest-bedroom': [
    'Lean toward guarded honesty, cramped energy, and small signs of discomfort.',
    'Let the characters feel aware that the space is temporary, borrowed, and not fully theirs.',
  ],
  'living-room': [
    'Lean toward a casual, social rhythm with more room for banter and deflection.',
    'Keep the conversation grounded in everyday observations before it sharpens into conflict.',
  ],
  'sacrificial-altar': [
    'This room enforces personality inversion. For each speaker, identify the clearest dominant traits in their brief, then play the behavioral opposite of those traits in this scene.',
    'Preserve the recognizable core of the character: the same relationships, history, and voice should still be visible beneath the inversion.',
    'Invert instincts and decision-making, not identity. A reassuring character should needle or provoke, a blunt character should evade or manipulate, and a reckless character should suddenly control themselves or overcalculate.',
    'The inversion should be obvious in dialogue style, emotional choices, and what the character pushes for from moment to moment.',
  ],
};
