import { ASSET_MANIFEST } from '../config/assets.js';

export class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
    }

    create() {
        this.add.text(400, 80, 'CHOOSE YOUR WRESTLER', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);

        const characters = Object.keys(ASSET_MANIFEST).filter(k => k !== 'announcer' && k !== 'referee');
        let startX = 150;
        let startY = 220;

        characters.forEach((key, index) => {
            const charData = ASSET_MANIFEST[key];
            const btn = this.add.rectangle(startX, startY, 140, 160, charData.color).setInteractive();
            this.add.text(startX, startY + 90, charData.name, { fontSize: '14px', fill: '#fff' }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                this.scene.start('GameScene', { playerChar: key, opponentChar: characters[(index + 1) % characters.length] });
            });

            startX += 170;
            if ((index + 1) % 4 === 0) {
                startX = 150;
                startY += 200;
            }
        });
    }
}