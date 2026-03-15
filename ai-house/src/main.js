import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { GameScene } from './scenes/GameScene.js';
import { gameConfig } from './game-config.js';

// Replace the placeholder scene entry with the real class
gameConfig.scene = [BootScene, GameScene];

if (!import.meta.env.TEST) {
  new Phaser.Game(gameConfig);
}
