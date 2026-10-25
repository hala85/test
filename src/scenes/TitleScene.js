export class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width / 2, height / 3, 'BONK!', {
            fontSize: '64px',
            fill: '#ff007f',
            fontStyle: 'bold',
            stroke: '#fff',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 20, 'The Digital Champ Rebuilt', {
            fontSize: '20px',
            fill: '#00ffff'
        }).setOrigin(0.5);

        const startButton = this.add.text(width / 2, height / 1.5, '[ PRESS ENTER TO WRESTLE ]', {
            fontSize: '24px',
            fill: '#ffff00',
            backgroundColor: '#222',
            padding: { x: 15, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('CharacterSelectScene');
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('CharacterSelectScene');
        });
    }
}