import { describe, it, expect } from 'vitest';
import { ROOM_LAYOUT, getPath } from '../../src/rooms/RoomLayout.js';

describe('ROOM_LAYOUT.rooms', () => {
  it('has exactly 4 rooms', () => {
    expect(Object.keys(ROOM_LAYOUT.rooms)).toHaveLength(4);
  });

  it('has all expected room ids', () => {
    expect(ROOM_LAYOUT.rooms).toHaveProperty('bedroom');
    expect(ROOM_LAYOUT.rooms).toHaveProperty('living_room');
    expect(ROOM_LAYOUT.rooms).toHaveProperty('kitchen');
    expect(ROOM_LAYOUT.rooms).toHaveProperty('mystery_room');
  });

  it.each([
    ['bedroom',      0,   0],
    ['living_room',  480, 0],
    ['kitchen',      0,   320],
    ['mystery_room', 480, 320],
  ])('%s is at x=%i y=%i', (id, x, y) => {
    expect(ROOM_LAYOUT.rooms[id].x).toBe(x);
    expect(ROOM_LAYOUT.rooms[id].y).toBe(y);
  });

  it.each(['bedroom', 'living_room', 'kitchen', 'mystery_room'])(
    '%s has width=480 and height=320',
    (id) => {
      expect(ROOM_LAYOUT.rooms[id].width).toBe(480);
      expect(ROOM_LAYOUT.rooms[id].height).toBe(320);
    }
  );

  it.each(['bedroom', 'living_room', 'kitchen', 'mystery_room'])(
    '%s has a floorColor starting with #',
    (id) => {
      expect(ROOM_LAYOUT.rooms[id].floorColor).toMatch(/^#/);
    }
  );

  it.each(['bedroom', 'living_room', 'kitchen', 'mystery_room'])(
    '%s has 3 characterSpots',
    (id) => {
      expect(ROOM_LAYOUT.rooms[id].characterSpots).toHaveLength(3);
    }
  );

  it.each(['bedroom', 'living_room', 'kitchen', 'mystery_room'])(
    'all characterSpots in %s are within room bounds',
    (id) => {
      const room = ROOM_LAYOUT.rooms[id];
      for (const spot of room.characterSpots) {
        expect(spot.x).toBeGreaterThanOrEqual(room.x);
        expect(spot.x).toBeLessThanOrEqual(room.x + room.width);
        expect(spot.y).toBeGreaterThanOrEqual(room.y);
        expect(spot.y).toBeLessThanOrEqual(room.y + room.height);
      }
    }
  );
});

describe('ROOM_LAYOUT.doorways', () => {
  it('has exactly 3 doorways', () => {
    expect(ROOM_LAYOUT.doorways).toHaveLength(3);
  });

  it('each doorway has rooms (2-element array), center {x,y}, and orientation', () => {
    for (const d of ROOM_LAYOUT.doorways) {
      expect(d.rooms).toHaveLength(2);
      expect(d.center).toHaveProperty('x');
      expect(d.center).toHaveProperty('y');
      expect(['vertical', 'horizontal']).toContain(d.orientation);
    }
  });

  it('no doorway connects kitchen and mystery_room', () => {
    const blocked = ROOM_LAYOUT.doorways.find(
      (d) =>
        (d.rooms.includes('kitchen') && d.rooms.includes('mystery_room'))
    );
    expect(blocked).toBeUndefined();
  });

  it('has doorway center at (480, 160) between bedroom and living_room', () => {
    const d = ROOM_LAYOUT.doorways.find(
      (dw) => dw.rooms.includes('bedroom') && dw.rooms.includes('living_room')
    );
    expect(d).toBeDefined();
    expect(d.center).toEqual({ x: 480, y: 160 });
    expect(d.orientation).toBe('vertical');
  });

  it('has doorway center at (240, 320) between bedroom and kitchen', () => {
    const d = ROOM_LAYOUT.doorways.find(
      (dw) => dw.rooms.includes('bedroom') && dw.rooms.includes('kitchen')
    );
    expect(d).toBeDefined();
    expect(d.center).toEqual({ x: 240, y: 320 });
    expect(d.orientation).toBe('horizontal');
  });

  it('has doorway center at (720, 320) between living_room and mystery_room', () => {
    const d = ROOM_LAYOUT.doorways.find(
      (dw) => dw.rooms.includes('living_room') && dw.rooms.includes('mystery_room')
    );
    expect(d).toBeDefined();
    expect(d.center).toEqual({ x: 720, y: 320 });
    expect(d.orientation).toBe('horizontal');
  });
});

describe('ROOM_LAYOUT.adjacency', () => {
  it('bedroom is adjacent to living_room and kitchen', () => {
    expect(ROOM_LAYOUT.adjacency.bedroom).toContain('living_room');
    expect(ROOM_LAYOUT.adjacency.bedroom).toContain('kitchen');
    expect(ROOM_LAYOUT.adjacency.bedroom).toHaveLength(2);
  });

  it('living_room is adjacent to bedroom and mystery_room', () => {
    expect(ROOM_LAYOUT.adjacency.living_room).toContain('bedroom');
    expect(ROOM_LAYOUT.adjacency.living_room).toContain('mystery_room');
    expect(ROOM_LAYOUT.adjacency.living_room).toHaveLength(2);
  });

  it('kitchen is adjacent to bedroom only', () => {
    expect(ROOM_LAYOUT.adjacency.kitchen).toContain('bedroom');
    expect(ROOM_LAYOUT.adjacency.kitchen).toHaveLength(1);
  });

  it('mystery_room is adjacent to living_room only', () => {
    expect(ROOM_LAYOUT.adjacency.mystery_room).toContain('living_room');
    expect(ROOM_LAYOUT.adjacency.mystery_room).toHaveLength(1);
  });
});

describe('getPath', () => {
  it('bedroom → mystery_room returns 3-element path', () => {
    expect(getPath('bedroom', 'mystery_room')).toEqual(['bedroom', 'living_room', 'mystery_room']);
  });

  it('kitchen → mystery_room returns 4-element path', () => {
    expect(getPath('kitchen', 'mystery_room')).toEqual(['kitchen', 'bedroom', 'living_room', 'mystery_room']);
  });

  it('bedroom → bedroom returns [bedroom]', () => {
    expect(getPath('bedroom', 'bedroom')).toEqual(['bedroom']);
  });

  it('reverse paths are defined', () => {
    expect(getPath('mystery_room', 'bedroom')).toEqual(['mystery_room', 'living_room', 'bedroom']);
    expect(getPath('living_room', 'kitchen')).toEqual(['living_room', 'bedroom', 'kitchen']);
  });

  it('all pre-computed paths match spec', () => {
    const expected = {
      'bedroom->living_room':      ['bedroom', 'living_room'],
      'bedroom->kitchen':          ['bedroom', 'kitchen'],
      'bedroom->mystery_room':     ['bedroom', 'living_room', 'mystery_room'],
      'living_room->bedroom':      ['living_room', 'bedroom'],
      'living_room->kitchen':      ['living_room', 'bedroom', 'kitchen'],
      'living_room->mystery_room': ['living_room', 'mystery_room'],
      'kitchen->bedroom':          ['kitchen', 'bedroom'],
      'kitchen->living_room':      ['kitchen', 'bedroom', 'living_room'],
      'kitchen->mystery_room':     ['kitchen', 'bedroom', 'living_room', 'mystery_room'],
      'mystery_room->bedroom':     ['mystery_room', 'living_room', 'bedroom'],
      'mystery_room->living_room': ['mystery_room', 'living_room'],
      'mystery_room->kitchen':     ['mystery_room', 'living_room', 'bedroom', 'kitchen'],
    };
    for (const [key, path] of Object.entries(expected)) {
      const [from, to] = key.split('->');
      expect(getPath(from, to)).toEqual(path);
    }
  });
});
