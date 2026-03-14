// Pure config — no Phaser import so Vitest can load this in Node without browser APIs.
// Phaser.AUTO = 0; we use the literal to avoid importing Phaser here.
// BootScene is passed as a string key and resolved by main.js at runtime.

export const gameConfig = {
  type: 0, // Phaser.AUTO
  width: 960,
  height: 640,
  pixelArt: true,
  antialias: false,
  scene: ['BootScene'],
};
