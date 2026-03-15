export const ROOM_LAYOUT = {
  rooms: {
    bedroom: {
      x: 0, y: 0, width: 480, height: 320,
      floorColor: '#c8a96e',
      characterSpots: [
        { x: 220, y: 180 },
        { x: 260, y: 180 },
        { x: 240, y: 200 },
      ],
    },
    living_room: {
      x: 480, y: 0, width: 480, height: 320,
      floorColor: '#d4b483',
      characterSpots: [
        { x: 700, y: 180 },
        { x: 740, y: 180 },
        { x: 720, y: 200 },
      ],
    },
    kitchen: {
      x: 0, y: 320, width: 480, height: 320,
      floorColor: '#e8e0d0',
      characterSpots: [
        { x: 220, y: 460 },
        { x: 260, y: 460 },
        { x: 240, y: 480 },
      ],
    },
    mystery_room: {
      x: 480, y: 320, width: 480, height: 320,
      floorColor: '#2a2030',
      characterSpots: [
        { x: 700, y: 460 },
        { x: 740, y: 460 },
        { x: 720, y: 480 },
      ],
    },
  },

  doorways: [
    {
      rooms: ['bedroom', 'living_room'],
      center: { x: 480, y: 160 },
      orientation: 'vertical',
    },
    {
      rooms: ['bedroom', 'kitchen'],
      center: { x: 240, y: 320 },
      orientation: 'horizontal',
    },
    {
      rooms: ['living_room', 'mystery_room'],
      center: { x: 720, y: 320 },
      orientation: 'horizontal',
    },
  ],

  adjacency: {
    bedroom:      ['living_room', 'kitchen'],
    living_room:  ['bedroom', 'mystery_room'],
    kitchen:      ['bedroom'],
    mystery_room: ['living_room'],
  },

  paths: {
    'bedroom->bedroom':              ['bedroom'],
    'bedroom->living_room':          ['bedroom', 'living_room'],
    'bedroom->kitchen':              ['bedroom', 'kitchen'],
    'bedroom->mystery_room':         ['bedroom', 'living_room', 'mystery_room'],
    'living_room->living_room':      ['living_room'],
    'living_room->bedroom':          ['living_room', 'bedroom'],
    'living_room->kitchen':          ['living_room', 'bedroom', 'kitchen'],
    'living_room->mystery_room':     ['living_room', 'mystery_room'],
    'kitchen->kitchen':              ['kitchen'],
    'kitchen->bedroom':              ['kitchen', 'bedroom'],
    'kitchen->living_room':          ['kitchen', 'bedroom', 'living_room'],
    'kitchen->mystery_room':         ['kitchen', 'bedroom', 'living_room', 'mystery_room'],
    'mystery_room->mystery_room':    ['mystery_room'],
    'mystery_room->living_room':     ['mystery_room', 'living_room'],
    'mystery_room->bedroom':         ['mystery_room', 'living_room', 'bedroom'],
    'mystery_room->kitchen':         ['mystery_room', 'living_room', 'bedroom', 'kitchen'],
  },
};

export function getPath(fromId, toId) {
  return ROOM_LAYOUT.paths[fromId + '->' + toId];
}
