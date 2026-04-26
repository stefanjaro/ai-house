# Phase 02 - Apartment Layout and Collision Map

Status: `NOT STARTED`  
Completion date: `-`

## Purpose

Turn the visual apartment into a navigable map with room boundaries, furniture, and non-walkable geometry.

## Scope

- Implement the rectangular one-level apartment with four rooms from the v5 idea.
- Add the hallway and room connectivity.
- Define walkable areas and blocked furniture/appliance/fitting zones.
- Represent room metadata needed later for prompt context.
- Render a debug overlay for collision and room boundaries that can be toggled in development.

## Tests First

Write tests before implementation for:

- Room registry: all required rooms exist with stable ids and display names.
- Connectivity: the couple bedroom is accessible from the living/dining room; guest bedroom and altar room connect through the hallway.
- Collision: known furniture points are blocked and known floor points are walkable.
- Room lookup: coordinates resolve to the correct room or blocked state.

## Implementation Notes

- Keep pathing and collision pure in `src/engine/` so tests do not need the DOM.
- Store geometry as structured data, not as ad hoc string parsing.
- The altar room must carry a room influence flag for later prompt construction.
- Do not add interactable furniture in this phase.

## Browser Verification

- Toggle the debug overlay in the running app.
- Confirm every room, hallway, and blocked furnishing area lines up with the visible SVG scene.
- Check desktop and mobile viewport scaling.

## Acceptance Criteria

- The apartment map is visually clear and geometrically testable.
- Characters cannot later be routed through blocked furniture if they use this map.
- Development collision overlay can be enabled without changing production behavior.

## Divergence Log

No divergences yet.

