# Phase 02 — World Layout & Character Movement

**Status:** `[DONE]` — Completed 2026-03-14. 66 tests passing (15 pre-existing + 51 new).
**Depends on:** Phase 01 complete and tested
**Goal:** See the 4-room house on screen with 3 characters walking around in it.

---

## What You'll Be Able to Test

After this phase you will see:
- A top-down house divided into 4 rooms with visible walls, floors, and basic furniture
- 3 characters (husband, wife, poltergeist) rendered as pixel art sprites with walking animations
- Characters automatically navigate between rooms when instructed (you'll trigger this via the `M` key for testing)
- Room access rules enforced: poltergeist cannot enter the bedroom; husband/wife cannot enter the mystery room

---

## What Gets Built

### 1. Room Layout

The house is drawn directly in Phaser (no Tiled/tilemap JSON). The canvas (960×640px) is divided into 4 rooms using coloured rectangles for floors and walls:

```
┌──────────────┬──────────────┐
│   BEDROOM    │  LIVING ROOM │
│  (top-left)  │ (top-right)  │
├──────────────┼──────────────┤
│   KITCHEN    │   MYSTERY    │
│ (bot-left)   │ (bot-right)  │
└──────────────┴──────────────┘
```

Each room is 480×320px (half the canvas width and height). Room floors are flat colours:
- Bedroom: warm tan `#c8a96e`
- Living room: light wood `#d4b483`
- Kitchen: off-white tile `#e8e0d0`
- Mystery room: dark stone `#2a2030`

Walls are dark grey `#444` rectangles drawn along the room boundaries. Doorways are gaps in the wall lines between adjacent rooms.

### 2. Furniture Sprites

Each furniture piece is an individual PNG sprite placed at a fixed position within its room. Furniture acts as a visual prop only in this phase (collision added in a later phase if needed).

**Bedroom:** bed, cupboard
**Living room:** couch, TV, rug
**Kitchen:** table, 2 chairs, sink/countertop
**Mystery room:** altar

### 3. Character Sprites

Three sprite sheets, one per character. Each sprite sheet contains walking animations in 4 directions (down, up, left, right) — 4 frames per direction = 16 frames total.

Sprite frame size: 32×48px
Sprite sheet layout: 4 columns (frames) × 4 rows (directions), total sheet size 128×192px

**Characters:**
- **Husband:** Casual human male, pixel art, top-down perspective
- **Wife:** Casual human female, pixel art, top-down perspective
- **Poltergeist:** Small red devil with horns and tail, pixel art, top-down perspective

### 4. Navigation

Characters use a waypoint system: each room has a pre-defined standing spot. When told to move, a character walks in a straight line toward the doorway, then to the standing spot. No pathfinding library needed for 4 rooms.

Movement speed: 80px/second. Walking animation plays while moving; idle frame (first frame of down-facing row) shown when stopped.

### 5. Room Access Enforcement

A `RoomAccessRules` module checks character identity before allowing navigation:
- `poltergeist` → blocked from `bedroom`
- `husband`, `wife` → blocked from `mystery_room`

### 6. Test Controls (Temporary)

`M` key cycles each character through rooms to verify navigation and access rules. Removed in Phase 05.

---

## Your Actions Required (Art Generation)

Generate all assets below using Gemini. **Important notes before you start:**

1. **Do not request transparent backgrounds from Gemini** — it fakes transparency with a grey/white checkerboard. Instead, request a **white background**, then use [remove.bg](https://remove.bg) to convert to real transparency.
2. After each image is generated, **resize with ImageMagick** if the output dimensions don't match exactly.
3. All files go into `ai-house/assets/sprites/` or `ai-house/assets/tilesets/` as noted.

---

### Character Sprite Sheets (3 files)

**Required size:** 128×192px per file
**Resize command if needed:** `magick INPUT.png -resize 128x192! OUTPUT.png`

#### `assets/sprites/husband.png`
> "Top-down pixel art character sprite sheet for a 2D game. 128x192 white background PNG. 4 columns, 4 rows. Row 1: walking down animation (4 frames). Row 2: walking left animation (4 frames). Row 3: walking right animation (4 frames). Row 4: walking up animation (4 frames). Character: casual human male, viewed from above at a slight angle, 32x48 pixels per frame. Clean pixel art style, visible legs animating, consistent colour palette. No background, no labels, no borders."

#### `assets/sprites/wife.png`
> "Top-down pixel art character sprite sheet for a 2D game. 128x192 white background PNG. 4 columns, 4 rows. Row 1: walking down animation (4 frames). Row 2: walking left animation (4 frames). Row 3: walking right animation (4 frames). Row 4: walking up animation (4 frames). Character: casual human female, viewed from above at a slight angle, 32x48 pixels per frame. Clean pixel art style, visible legs animating, consistent colour palette. No background, no labels, no borders."

#### `assets/sprites/poltergeist.png`
> "Top-down pixel art character sprite sheet for a 2D game. 128x192 white background PNG. 4 columns, 4 rows. Row 1: walking down animation (4 frames). Row 2: walking left animation (4 frames). Row 3: walking right animation (4 frames). Row 4: walking up animation (4 frames). Character: small mischievous red devil with tiny horns and a pointed tail, viewed from above at a slight angle, 32x48 pixels per frame. Clean pixel art style, visible legs animating, glowing eyes. No background, no labels, no borders."

---

### Furniture Sprites (9 files)

All furniture: **white background PNG**, pixel art, top-down perspective. Run through remove.bg after generating.

**Resize commands:**
```bash
magick bed.png        -resize 64x96!  assets/sprites/furniture/bed.png
magick cupboard.png   -resize 64x64!  assets/sprites/furniture/cupboard.png
magick couch.png      -resize 96x64!  assets/sprites/furniture/couch.png
magick tv.png         -resize 64x64!  assets/sprites/furniture/tv.png
magick rug.png        -resize 96x96!  assets/sprites/furniture/rug.png
magick table.png      -resize 96x64!  assets/sprites/furniture/table.png
magick chair.png      -resize 32x48!  assets/sprites/furniture/chair.png
magick sink.png       -resize 96x64!  assets/sprites/furniture/sink.png
magick altar.png      -resize 64x96!  assets/sprites/furniture/altar.png
```

#### `assets/sprites/furniture/bed.png` — target 64×96px
> "Top-down pixel art single bed for a 2D game. White background PNG. 64x96 pixels. Wooden bed frame with pillow and blanket, viewed from directly above. Clean pixel art, warm colours."

#### `assets/sprites/furniture/cupboard.png` — target 64×64px
> "Top-down pixel art wardrobe/cupboard for a 2D game. White background PNG. 64x64 pixels. Wooden wardrobe with two doors, viewed from directly above. Clean pixel art style."

#### `assets/sprites/furniture/couch.png` — target 96×64px
> "Top-down pixel art sofa/couch for a 2D game. White background PNG. 96x64 pixels. Red fabric two-seater sofa, viewed from directly above. Clean pixel art style."

#### `assets/sprites/furniture/tv.png` — target 64×64px
> "Top-down pixel art television set on a stand for a 2D game. White background PNG. 64x64 pixels. Retro CRT TV on a wooden stand, viewed from directly above. Clean pixel art style."

#### `assets/sprites/furniture/rug.png` — target 96×96px
> "Top-down pixel art decorative rug for a 2D game. White background PNG. 96x96 pixels. Ornate rectangular rug with border pattern, viewed from directly above. Clean pixel art, warm earthy tones."

#### `assets/sprites/furniture/table.png` — target 96×64px
> "Top-down pixel art kitchen dining table for a 2D game. White background PNG. 96x64 pixels. Rectangular wooden kitchen table, viewed from directly above. Clean pixel art style."

#### `assets/sprites/furniture/chair.png` — target 32×48px
> "Top-down pixel art wooden dining chair for a 2D game. White background PNG. 32x48 pixels. Simple wooden chair, viewed from directly above. Clean pixel art style."

#### `assets/sprites/furniture/sink.png` — target 96×64px
> "Top-down pixel art kitchen countertop with sink for a 2D game. White background PNG. 96x64 pixels. Kitchen counter with inset sink and tap, viewed from directly above. Clean pixel art style."

#### `assets/sprites/furniture/altar.png` — target 64×96px
> "Top-down pixel art dark stone altar/pedestal for a 2D game. White background PNG. 64x96 pixels. Eerie dark stone ritual altar with faint glowing runes, viewed from directly above. Clean pixel art style, dark purple and black tones."

---

### After Generating All Art

1. Run each image through [remove.bg](https://remove.bg) to replace the white background with true transparency.
2. Resize using the ImageMagick commands above if dimensions are off.
3. Place files in the correct folders under `ai-house/assets/`.
4. Tell me and I will wire everything together.

---

## Divergences from Original Spec

> **DIVERGENCE (2026-03-14):** Switched from Tiled tilemap + tileset approach to direct Phaser graphics + individual furniture sprites.
>
> **Reason:** Gemini cannot generate a correctly grid-aligned tileset (assets float freely on whitespace at inconsistent sizes). A tileset requires exact pixel-grid positioning which Gemini does not reliably produce.
>
> **Impact:** No tilemap JSON, no Tiled dependency. Rooms are drawn with Phaser rectangle primitives (coloured floors + wall lines). Furniture are individual PNG sprites. Navigation logic is unchanged. This simplifies the implementation.
