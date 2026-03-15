import Phaser from 'phaser';
import { ROOM_LAYOUT } from '../rooms/RoomLayout.js';
import { canEnter } from '../characters/RoomAccessRules.js';
import { Character } from '../characters/Character.js';

const WALL_COLOR     = 0x3D2B1F;
const WALL_THICKNESS = 16;
const DOORWAY_GAP    = 48;
const OUTER_BORDER   = 8;


// Furniture atlas: frame rectangles in FurnitureState1/2.png
// { sheet, x, y, w, h } — coordinates verified by ImageMagick extraction
const FURNITURE_ATLAS = {
  wardrobe:      { sheet: 'furniture1', x: 0,   y: 0,   w: 32, h: 48  },
  bookshelf:     { sheet: 'furniture1', x: 0,   y: 48,  w: 48, h: 48  },
  bookshelf2:    { sheet: 'furniture1', x: 48,  y: 48,  w: 48, h: 48  },
  sofa_large:    { sheet: 'furniture1', x: 16,  y: 144, w: 96, h: 48  },
  armchair:      { sheet: 'furniture1', x: 128, y: 144, w: 32, h: 48  },
  rug_large:     { sheet: 'furniture1', x: 176, y: 48,  w: 32, h: 48  },
  plant_round:   { sheet: 'furniture1', x: 0,   y: 144, w: 16, h: 48  },
  fridge:        { sheet: 'furniture1', x: 0,   y: 192, w: 32, h: 48  },
  stove_oven:    { sheet: 'furniture1', x: 48,  y: 192, w: 48, h: 48  },
  counter:       { sheet: 'furniture1', x: 96,  y: 192, w: 80, h: 32  },
  coffee_table:  { sheet: 'furniture1', x: 16,  y: 240, w: 32, h: 32  },
  nightstand:    { sheet: 'furniture1', x: 176, y: 240, w: 32, h: 32  },
  mirror:        { sheet: 'furniture1', x: 112, y: 96,  w: 32, h: 80  },
  floor_lamp:    { sheet: 'furniture1', x: 80,  y: 96,  w: 16, h: 80  },
  // Sheet 1 — itch.io extracted furniture
  bed_double:    { sheet: 'furniture1', x: 0,   y: 96,  w: 48, h: 96  },
  dining_table:  { sheet: 'furniture1', x: 64,  y: 240, w: 64, h: 48  },
  dining_chair:  { sheet: 'furniture1', x: 96,  y: 0,   w: 16, h: 32  },
  // Sheet 2 — dark/mystery variants
  dark_wardrobe: { sheet: 'furniture2', x: 0,   y: 0,   w: 32, h: 96  },
  clock:         { sheet: 'furniture2', x: 64,  y: 96,  w: 32, h: 96  },
  sofa_dark:     { sheet: 'furniture2', x: 16,  y: 144, w: 96, h: 48  },
  armchair_dark: { sheet: 'furniture2', x: 128, y: 144, w: 32, h: 48  },
};

// Furniture placement: [frameKey, gameX, gameY] — all keys must exist in FURNITURE_ATLAS
const FURNITURE_LAYOUT = [
  // --- Bedroom (x:0–480, y:0–320) ---
  ['bed_double', 220,  72],   // north wall center
  ['wardrobe',   440,  80],   // east wall
  ['nightstand', 150,  68],   // left of bed
  ['nightstand', 290,  68],   // right of bed
  ['mirror',      50, 130],   // west wall
  ['floor_lamp', 420, 290],   // southeast corner

  // --- Living Room (x:480–960, y:0–320) ---
  ['rug_large',  720, 170],   // center
  ['sofa_large', 720, 258],   // south, facing north (on rug)
  ['armchair',   510, 170],   // west
  ['armchair',   928, 170],   // east
  ['bookshelf2', 936,  78],   // east wall
  ['plant_round', 500, 285],  // southwest corner

  // --- Kitchen (x:0–480, y:320–640) ---
  ['fridge',      28, 368],   // northwest corner
  ['stove_oven',  88, 372],   // west wall, next to fridge
  ['counter',    200, 338],   // north wall
  ['dining_table', 270, 490],  // center-right
  ['dining_chair', 175, 490],  // left of table
  ['dining_chair', 365, 490],  // right of table

  // --- Mystery Room (x:480–960, y:320–640) ---
  ['dark_wardrobe', 720, 365], // north center
  ['clock',      505, 430],   // west wall
  ['sofa_dark',  720, 490],   // south
  ['armchair_dark', 868, 400], // east side
];

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Character spritesheets
    this.load.spritesheet('husband',     'sprites/husband.png',     { frameWidth: 46, frameHeight: 46 });
    this.load.spritesheet('wife',        'sprites/wife.png',        { frameWidth: 46, frameHeight: 46 });
    this.load.spritesheet('poltergeist', 'sprites/poltergeist.png', { frameWidth: 24, frameHeight: 24 });

    // Furniture sheets (full images — frames defined programmatically)
    this.load.image('furniture1', 'sprites/furniture/sheet1.png');
    this.load.image('furniture2', 'sprites/furniture/sheet2.png');

  }

  create() {
    this._registerFurnitureFrames();
    this._drawRooms();
    this._drawWalls();
    this._placeFurniture();
    this._registerAnimations();
    this._createCharacters();

    this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this._moveIndex = 0;

    this._cycles = {
      husband:     ['bedroom', 'living_room', 'kitchen'],
      wife:        ['bedroom', 'kitchen', 'living_room'],
      poltergeist: ['mystery_room', 'living_room', 'kitchen', 'bedroom', 'mystery_room'],
    };
    this._cycleIndices = { husband: 0, wife: 0, poltergeist: 0 };
  }

  update(time, delta) {
    for (const char of this._characters) {
      char.update(delta);
    }

    if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
      this._triggerNextMove();
    }
  }

  _registerFurnitureFrames() {
    const tex1 = this.textures.get('furniture1');
    const tex2 = this.textures.get('furniture2');
    for (const [name, f] of Object.entries(FURNITURE_ATLAS)) {
      const tex = f.sheet === 'furniture1' ? tex1 : tex2;
      // Only add if not already registered (duplicate names in layout are fine)
      if (!tex.frames[name]) {
        tex.add(name, 0, f.x, f.y, f.w, f.h);
      }
    }
  }

  _drawRooms() {
    for (const [id, room] of Object.entries(ROOM_LAYOUT.rooms)) {
      const color = Phaser.Display.Color.HexStringToColor(room.floorColor).color;
      this.add.rectangle(
        room.x + room.width / 2,
        room.y + room.height / 2,
        room.width,
        room.height,
        color
      );
    }
  }

  _drawWalls() {
    const g = this.add.graphics();
    g.fillStyle(WALL_COLOR, 1);

    const T  = WALL_THICKNESS;
    const HT = T / 2;
    const HG = DOORWAY_GAP / 2;

    // Outer border
    g.fillRect(0, 0, 960, OUTER_BORDER);             // top
    g.fillRect(0, 640 - OUTER_BORDER, 960, OUTER_BORDER); // bottom
    g.fillRect(0, 0, OUTER_BORDER, 640);             // left
    g.fillRect(960 - OUTER_BORDER, 0, OUTER_BORDER, 640); // right

    // Vertical divider at x=480 — bedroom ↔ living_room, doorway at y=160
    const vx = 480 - HT;
    g.fillRect(vx, 0, T, 160 - HG);
    g.fillRect(vx, 160 + HG, T, 640 - (160 + HG));

    // Horizontal divider at y=320 — two doorways: x=240 (bed↔kit) and x=720 (liv↔mys)
    const hy = 320 - HT;
    g.fillRect(0,            hy, 240 - HG, T);
    g.fillRect(240 + HG,     hy, 720 - HG - (240 + HG), T);
    g.fillRect(720 + HG,     hy, 960 - (720 + HG), T);
  }

  _placeFurniture() {
    for (const [key, x, y] of FURNITURE_LAYOUT) {
      if (key in FURNITURE_ATLAS) {
        const f = FURNITURE_ATLAS[key];
        this.add.image(x, y, f.sheet, key).setDepth(1);
      } else {
        this.add.image(x, y, key).setDepth(1);
      }
    }
  }

  _registerAnimations() {
    // Husband & Wife — Boy_Sheet/Girl_Sheet: 46×46, 8 cols × 6 rows
    // Row 0=down(0–7), Row 1=left(8–15), Row 2=right(16–23), Row 4=up(32–39)
    const humanDirs = [
      { name: 'down',  start: 0,  end: 5  },
      { name: 'left',  start: 8,  end: 13 },
      { name: 'right', start: 16, end: 21 },
      { name: 'up',    start: 24, end: 29 },
    ];
    for (const charId of ['husband', 'wife']) {
      for (const dir of humanDirs) {
        this.anims.create({
          key: `${charId}-walk-${dir.name}`,
          frames: this.anims.generateFrameNumbers(charId, { start: dir.start, end: dir.end }),
          frameRate: 8,
          repeat: -1,
        });
      }
    }

    // Poltergeist — 24×24, 8 cols × 6 rows = 48 frames
    // Row 0=down(0–7), Row 1=left(8–15), Row 2=right(16–23), Row 3=up(24–31)
    const ghostDirs = [
      { name: 'down',  start: 0,  end: 5  },
      { name: 'left',  start: 8,  end: 13 },
      { name: 'right', start: 16, end: 21 },
      { name: 'up',    start: 24, end: 29 },
    ];
    for (const dir of ghostDirs) {
      this.anims.create({
        key: `poltergeist-walk-${dir.name}`,
        frames: this.anims.generateFrameNumbers('poltergeist', { start: dir.start, end: dir.end }),
        frameRate: 6,
        repeat: -1,
      });
    }
  }

  _createCharacters() {
    const bedroomSpots = ROOM_LAYOUT.rooms.bedroom.characterSpots;
    const mysterySpots = ROOM_LAYOUT.rooms.mystery_room.characterSpots;

    this._husband     = new Character(this, bedroomSpots[0].x, bedroomSpots[0].y, 'husband',     'husband',     'bedroom',      0);
    this._wife        = new Character(this, bedroomSpots[1].x, bedroomSpots[1].y, 'wife',        'wife',        'bedroom',      1);
    this._poltergeist = new Character(this, mysterySpots[2].x, mysterySpots[2].y, 'poltergeist', 'poltergeist', 'mystery_room', 2);

    this._characters = [this._husband, this._wife, this._poltergeist];
    this._charIds    = ['husband', 'wife', 'poltergeist'];
  }

  _triggerNextMove() {
    const charId = this._charIds[this._moveIndex % 3];
    this._moveIndex++;

    const char  = this._characters[this._charIds.indexOf(charId)];
    const cycle = this._cycles[charId];
    const idx   = this._cycleIndices[charId];

    let next = null;
    for (let i = 0; i < cycle.length; i++) {
      const candidate = cycle[(idx + i) % cycle.length];
      if (candidate !== char.currentRoom && canEnter(charId, candidate)) {
        next = candidate;
        this._cycleIndices[charId] = (idx + i + 1) % cycle.length;
        break;
      }
    }

    if (next) {
      char.moveTo(next);
    }
  }
}
