# Phase 03 - Character Sprites and Movement Feel

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Make the three characters feel present in the house before conversations or LLM behavior are added.

## Scope

- Create SVG sprites for husband, wife, and husband's male best friend.
- Add idle and walking visual states.
- Add deterministic room-to-room movement using the collision map.
- Show selected destination and travel progress.
- Place characters in sensible default rooms at game start and at end-of-day bedrooms later.

## Tests First

Write tests before implementation for:

- Character registry: three playable characters exist with stable ids.
- Spawn placement: default coordinates are walkable and inside expected rooms.
- Path generation: paths avoid blocked geometry and reach target rooms.
- Movement state transitions: idle to walking to arrived.

## Implementation Notes

- Use simple, readable animation first; polish can happen later.
- Pathing can be grid-based or waypoint-based, whichever best matches the apartment geometry.
- Keep movement independent from day rules so later phases can reuse it for all travel moments.

## Browser Verification

- Run the app and send each character between rooms through a temporary dev control or scripted demo.
- Confirm sprites are visible, scaled correctly, face or imply direction appropriately, and do not walk through furniture.
- Confirm travel remains legible on narrow viewports.

## Acceptance Criteria

- All three characters can be visually distinguished.
- Characters can move between all valid room pairs.
- Collision is respected during movement.

## Divergence Log

No divergences yet.

