export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        this.add.text(400, 250, 'GAME PAUSED', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const resumeBtn = this.add.text(400, 350, '[ RESUME ]', { fontSize: '20px', fill: '#00ffcc' }).setOrigin(0.5).setInteractive();
        resumeBtn.on('pointerdown', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
    }
}