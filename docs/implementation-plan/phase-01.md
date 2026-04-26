# Phase 01 - Visual Direction and SVG Asset System

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Establish the look of AI House before game logic exists. The game should feel like a contemporary top-down apartment simulation, not a retro browser novelty.

## Scope

- Define the visual language for the apartment, UI chrome, character scale, and conversation overlay.
- Create the SVG asset structure under `public/assets/`.
- Build a static first-viewport scene that proves SVG rendering, scaling, and layering.
- Create reusable conventions for room backgrounds, furniture, collision outlines, sprites, and interactive overlays.

## Tests First

Write tests before implementation for:

- Asset manifest shape: expected room, furniture, character, and UI asset entries exist.
- SVG loading references: the app resolves asset URLs consistently.
- Visual shell DOM: the static scene renders the expected layers and accessibility labels.

## Implementation Notes

- Prefer hand-authored SVG assets in the repo.
- Keep asset names stable because later phases will refer to them for collision and room rendering.
- The altar room should be visually incompatible with the apartment style by design, while still fitting the same top-down camera.
- Keep early UI sparse: the first screen should show the game, not marketing copy.

## Browser Verification

- Open the app in Chrome DevTools MCP.
- Confirm the static apartment preview fills the viewport appropriately on desktop and mobile widths.
- Capture or inspect that SVG layers are visible, crisp, and not distorted.

## Acceptance Criteria

- A static visual prototype exists and loads from project assets.
- SVG conventions are documented in code or nearby docs only where needed.
- No gameplay rules are implemented beyond what is necessary to render the scene.

## Divergence Log

No divergences yet.

