# Phase 02 — World Layout & Character Movement

**Status:** `[ ] TODO`
**Depends on:** Phase 01 complete and tested
**Goal:** See the 4-room house on screen with 3 characters walking around in it.

---

## What You'll Be Able to Test

After this phase you will see:
- A top-down house divided into 4 rooms with visible walls, floors, and basic furniture
- 3 characters (husband, wife, poltergeist) rendered as pixel art sprites with walking animations
- Characters automatically navigate between rooms when instructed (you'll trigger this via a keyboard shortcut or on-screen button for testing)
- Room access rules enforced: poltergeist cannot enter the bedroom; husband/wife cannot enter the mystery room

---

## What Gets Built

### 1. Tilemap Layout

The house is a single tilemap loaded from a JSON file (created with Tiled map editor, exported as JSON). The map is divided into 4 rooms:

```
┌──────────────┬──────────────┐
│   BEDROOM    │  LIVING ROOM │
│  (top-left)  │ (top-right)  │
├──────────────┼──────────────┤
│   KITCHEN    │   MYSTERY    │
│ (bot-left)   │ (bot-right)  │
└──────────────┴──────────────┘
```

Each room has:
- A floor tile layer
- A wall/boundary layer (impassable)
- A furniture/decoration layer (impassable objects)
- A room label layer (for debugging — hidden in final game)

The overall map size: 30×20 tiles at 32×32px per tile = 960×640px canvas (matches Phase 01).

### 2. Tileset

One tileset image used for all rooms. Required tiles:
- Floor variants: wood (bedroom, living room), tile (kitchen), dark stone (mystery room)
- Walls: horizontal, vertical, corners (inner and outer)
- Doors: open archway between rooms (no actual door mechanic needed — rooms are always accessible per character rules)
- Furniture:
  - Bedroom: bed, cupboard
  - Living room: TV, couch, rug
  - Kitchen: table, 2 chairs, countertop with sink
  - Mystery room: eerie altar/pedestal, dark decor

### 3. Character Sprites

Three sprite sheets, one per character. Each sprite sheet contains walking animations in 4 directions (down, up, left, right) — 4 frames per direction = 16 frames total per sprite.

Sprite frame size: 32×48px (characters are taller than wide for a natural look)
Sprite sheet layout: 4 columns (frames) × 4 rows (directions)

**Characters:**
- **Husband:** Casual human male, pixel art, top-down perspective
- **Wife:** Casual human female, pixel art, top-down perspective
- **Poltergeist:** Small red/orange devil with horns and tail, pixel art, top-down perspective

### 4. Navigation

Characters use a simple waypoint system: given a target room, they pathfind to a pre-defined "standing spot" within that room. Pathfinding uses Phaser's built-in arcade physics + a navmesh or manual waypoint graph along room corridors.

Movement speed: 80px/second (feels natural, not too fast or slow).

Walking animation plays while moving; idle frame shown when stopped.

### 5. Room Access Enforcement

A `RoomAccessRules` module checks character identity before allowing navigation:
- `poltergeist` → blocked from `bedroom`
- `husband`, `wife` → blocked from `mystery_room`
- Mystery room entrance is visually hidden from husband/wife's perspective (no visible door)

### 6. Test Controls (Temporary)

A temporary on-screen button or keyboard shortcut (e.g., `M` key) cycles through test movements to verify navigation and access rules. This is removed in Phase 05 when the real game loop drives movement.

---

## Your Actions Required (Art Generation)

You will need to generate the following assets using Gemini before I can finish this phase. I will give you the exact prompts below.

### A. Tileset Image

**File:** `assets/tilesets/house-tileset.png`
**Required size:** 192×256px (6 tiles wide × 8 tiles tall, each tile 32×32px)
**Format:** PNG with transparency

**Gemini prompt:**
> "Top-down pixel art tileset for a 2D game. 32x32 pixel tiles arranged on a 192x256 transparent PNG. Include: wooden floor tile, stone floor tile, dark stone floor tile (for underworld), wall tile (grey brick), horizontal wall edge, vertical wall edge, corner wall piece, open doorway arch, bed (occupies 1 tile), wooden cupboard, couch (2 tiles wide), television set, rug (2x2 tiles), kitchen table, wooden chair, countertop with sink, a dark stone altar. Clean pixel art, limited palette, top-down perspective."

**Post-processing (ImageMagick):** None required if Gemini outputs at exactly 192×256. If the size is different, run:
```bash
magick house-tileset.png -resize 192x256! assets/tilesets/house-tileset.png
```

**Storage:** `ai-house/assets/tilesets/house-tileset.png`

---

### B. Character Sprite Sheets (3 files)

**File names:**
- `assets/sprites/husband.png`
- `assets/sprites/wife.png`
- `assets/sprites/poltergeist.png`

**Required size per file:** 128×192px (4 frames × 4 directions, each frame 32×48px)
**Format:** PNG with transparency

**Gemini prompt for husband:**
> "Top-down pixel art character sprite sheet for a 2D game. 128x192 transparent PNG. 4 columns, 4 rows. Row 1: walking down animation (4 frames). Row 2: walking left animation (4 frames). Row 3: walking right animation (4 frames). Row 4: walking up animation (4 frames). Character: casual human male, viewed from above at a slight angle, 32x48 pixels per frame. Clean pixel art style, visible legs animating, consistent colour palette."

**Gemini prompt for wife:**
> "Top-down pixel art character sprite sheet for a 2D game. 128x192 transparent PNG. 4 columns, 4 rows. Row 1: walking down animation (4 frames). Row 2: walking left animation (4 frames). Row 3: walking right animation (4 frames). Row 4: walking up animation (4 frames). Character: casual human female, viewed from above at a slight angle, 32x48 pixels per frame. Clean pixel art style, visible legs animating, consistent colour palette."

**Gemini prompt for poltergeist:**
> "Top-down pixel art character sprite sheet for a 2D game. 128x192 transparent PNG. 4 columns, 4 rows. Row 1: walking down animation (4 frames). Row 2: walking left animation (4 frames). Row 3: walking right animation (4 frames). Row 4: walking up animation (4 frames). Character: small mischievous red devil with tiny horns and a pointed tail, viewed from above at a slight angle, 32x48 pixels per frame. Clean pixel art style, visible legs animating, glowing eyes."

**Post-processing (ImageMagick):** Resize if needed:
```bash
magick husband.png -resize 128x192! assets/sprites/husband.png
magick wife.png -resize 128x192! assets/sprites/wife.png
magick poltergeist.png -resize 128x192! assets/sprites/poltergeist.png
```

**Storage:** `ai-house/assets/sprites/`

---

### C. After Generating Art

Once you have the art files placed in the correct folders, tell me and I will complete the tilemap setup and wire everything together.

---

## Notes on Tiled Map Editor

I will create the tilemap JSON file programmatically (no need for you to install Tiled). The map is defined in code during this phase to keep the setup simple.

---

## Divergences from Original Spec

_None._
