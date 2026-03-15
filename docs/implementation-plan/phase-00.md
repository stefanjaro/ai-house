# Phase 00 — Asset Specification & Generation

**Status:** DONE (2026-03-15)
**Depends on:** Nothing — can be done before any code is written
**User effort:** High (generation happens outside the IDE)

## Goal
Generate all static visual assets for the game before UI work begins. Having real assets from the start means the game's medieval look-and-feel can be validated early, and layout decisions can be made with actual imagery.

## Assets Required

### Room Backgrounds (4 images)
Displayed as the backdrop for each scene in the center screen. Should feel richly medieval, painterly or illustrated (not photorealistic).

**Dimensions:** 1280 × 720px (16:9)
**Format:** PNG or JPG

| Asset | Filename | Gemini Prompt |
|-------|----------|---------------|
| Bedroom | `public/assets/rooms/bedroom.png` | `A richly detailed medieval bedroom interior illustration. A grand four-poster canopy bed with heavy velvet drapes dominates the room. Stone walls with tapestries, a window with moonlight streaming in, candles on a wooden bedside table, a fur rug on the stone floor. Warm amber and deep blue tones. Painterly style, highly detailed, no people, wide landscape format.` |
| Living Room | `public/assets/rooms/living-room.png` | `A medieval great hall interior illustration. A large stone fireplace blazing with fire on one wall, heavy wooden furniture, tapestries depicting hunting scenes, candelabras, a worn wooden floor, arched stone doorways in the background. Warm golden firelight. Painterly style, highly detailed, no people, wide landscape format.` |
| Kitchen | `public/assets/rooms/kitchen.png` | `A medieval kitchen interior illustration. A large stone hearth with hanging iron pots and a roaring fire, bundles of dried herbs hanging from the ceiling, a rough-hewn wooden table with bread and vegetables, copper and clay pots on shelves, stone flagstone floor. Warm, rustic, earthy tones. Painterly style, highly detailed, no people, wide landscape format.` |
| Mystery Room | `public/assets/rooms/mystery-room.png` | `A dark and ominous underworld chamber illustration. Jagged black stone walls, glowing red and purple embers in cracks in the floor, eerie green torchlight, ancient demonic symbols carved into the walls, a swirling portal of dark energy in the background, bones and chains on the floor. Sinister, foreboding atmosphere. Painterly style, highly detailed, no people, wide landscape format.` |

### Character Sprites (3 images)
Full-body standing poses, transparent backgrounds, facing slightly toward the viewer. Should look consistent in style with each other.

**Dimensions:** 300 × 600px (portrait, full body)
**Format:** PNG with transparent background
**Post-processing:** Use remove.bg (or equivalent) to ensure clean transparent background. Do NOT use Gemini's built-in background removal as it fakes transparency with a white background.

| Asset | Filename | Gemini Prompt |
|-------|----------|---------------|
| Husband | `public/assets/sprites/husband.png` | `A full-body illustration of a medieval nobleman. He wears a fine tunic, hose, and a short velvet cloak. He has a calm, dignified expression. Standing pose, arms relaxed at sides, facing slightly toward viewer. Painterly illustration style, consistent with a storybook, plain white background, full body visible from head to toe.` |
| Wife | `public/assets/sprites/wife.png` | `A full-body illustration of a medieval noblewoman. She wears an elegant flowing gown with embroidered details and a simple wimple or veil. She has a warm, composed expression. Standing pose, arms relaxed at sides, facing slightly toward viewer. Painterly illustration style, consistent with a storybook, plain white background, full body visible from head to toe.` |
| Poltergeist | `public/assets/sprites/poltergeist.png` | `A full-body illustration of a small mischievous devil or imp. It has tiny curved horns, a pointed tail, bat-like wings folded behind, and a wide grinning expression. It is small and impish, not terrifying. Standing pose, arms slightly raised in a theatrical gesture. Painterly illustration style, consistent with a storybook, plain white background, full body visible from head to toe.` |

### UI Textures (2 images)
Used for modal pop-ups and decorative framing.

**Format:** PNG

| Asset | Filename | Dimensions | Gemini Prompt |
|-------|----------|------------|---------------|
| Parchment scroll | `public/assets/ui/parchment.png` | 800 × 1000px | `A texture of aged parchment or vellum. Yellowed, with subtle brown staining at the edges, slightly uneven surface, faint fibrous texture. No text, no illustrations. Seamless if possible. Isolated on a white background.` |
| Medieval border | `public/assets/ui/border.png` | 1000 × 1000px | `An ornate medieval decorative border or frame. Illuminated manuscript style. Rich red, gold, and dark green. Knotwork and foliage motifs in the corners and along the edges. The center is empty/transparent. PNG format with transparent center.` |

## Post-Processing Instructions

For character sprites specifically:
1. Generate the image with the Gemini prompt above
2. Go to [remove.bg](https://www.remove.bg) and upload the generated image
3. Download the result (transparent PNG)
4. Save it to the path shown in the table above

For room backgrounds and UI textures, no post-processing is needed — save directly to the path shown.

## Where to Place Files
All assets go into the `public/assets/` folder under the project root. Create the following subfolders:
```
public/assets/rooms/
public/assets/sprites/
public/assets/ui/
```

## How to Know This Phase Is Done
- All 9 asset files exist in their correct paths under `public/assets/`
- Character sprites have transparent backgrounds (checkerboard pattern visible when opened in an image editor)
- Room backgrounds look visually consistent in medieval painterly style
- No code is needed to "test" this phase — just visual inspection

## Divergences

> **DIVERGENCE — Sprite and parchment dimensions:** Gemini generated all images in landscape orientation (approx. 2816×1536). The plan specified portrait sprites at 300×600 and a portrait parchment at 800×1000. After resizing proportionally:
> - Sprites landed at **300×164** (landscape, not portrait)
> - Parchment landed at **800×436** (landscape, not portrait)
> - Room backgrounds and border are correct (1280×720 and 1000×1000)
>
> The background removal on sprites was verified correct (corners are transparent). However, the landscape orientation of sprites will affect how they display in-game. **Action required from user:** Inspect the sprites in `public/assets/sprites/` and decide whether to re-generate them with an explicit portrait orientation, or whether the landscape images look acceptable for the game's layout. If re-generating, add "tall portrait orientation, taller than wide, full body standing pose" to the Gemini prompt.
