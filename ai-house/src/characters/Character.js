import { canEnter } from './RoomAccessRules.js';
import { getPath, ROOM_LAYOUT } from '../rooms/RoomLayout.js';

const MOVE_SPEED = 80;
const ARRIVAL_THRESHOLD = 4;

export class Character {
  constructor(scene, x, y, textureKey, characterId, startRoomId, spotIndex) {
    this.scene = scene;
    this.characterId = characterId;
    this.currentRoom = startRoomId;
    this.spotIndex = spotIndex;

    this.sprite = scene.add.sprite(x, y, textureKey);
    this.sprite.setDepth(2);
    this.sprite.setFrame(0);
    this.sprite.setOrigin(0.5, 0.8);

    this._waypoints = [];
    this._moving = false;
  }

  moveTo(targetRoomId) {
    if (!canEnter(this.characterId, targetRoomId)) return;
    if (targetRoomId === this.currentRoom) return;

    const path = getPath(this.currentRoom, targetRoomId);
    if (!path) return;

    this._waypoints = [];

    // For each consecutive room pair, push the doorway center
    for (let i = 0; i < path.length - 1; i++) {
      const fromRoom = path[i];
      const toRoom = path[i + 1];
      const doorway = ROOM_LAYOUT.doorways.find(
        (d) => d.rooms.includes(fromRoom) && d.rooms.includes(toRoom)
      );
      if (doorway) {
        this._waypoints.push({ x: doorway.center.x, y: doorway.center.y });
      }
    }

    // Final destination: character's spot in target room
    const spot = ROOM_LAYOUT.rooms[targetRoomId].characterSpots[this.spotIndex];
    this._waypoints.push({ x: spot.x, y: spot.y });

    this._targetRoomId = targetRoomId;
    this._moving = true;
    this._playWalkAnimation();
  }

  update(delta) {
    if (!this._moving || this._waypoints.length === 0) return;

    const target = this._waypoints[0];
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const step = MOVE_SPEED * (delta / 1000);

    if (dist <= ARRIVAL_THRESHOLD) {
      this.sprite.x = target.x;
      this.sprite.y = target.y;
      this._waypoints.shift();

      if (this._waypoints.length === 0) {
        this._moving = false;
        this.currentRoom = this._targetRoomId;
        this.sprite.setFrame(0);
      } else {
        this._playWalkAnimation();
      }
    } else {
      this.sprite.x += (dx / dist) * step;
      this.sprite.y += (dy / dist) * step;
    }
  }

  _playWalkAnimation() {
    if (this._waypoints.length === 0) return;

    const target = this._waypoints[0];
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    let dir;

    if (Math.abs(dx) >= Math.abs(dy)) {
      dir = dx > 0 ? 'right' : 'left';
    } else {
      dir = dy > 0 ? 'down' : 'up';
    }

    this.sprite.play(`${this.characterId}-walk-${dir}`, true);
  }
}
