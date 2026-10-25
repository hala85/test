import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [
        BootScene,
        TitleScene,
        CharacterSelectScene,
        GameScene,
        PauseScene
    ]
};

new Phaser.Game(config);