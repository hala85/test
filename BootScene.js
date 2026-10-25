export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        console.log("Loading BONK! assets and fallback placeholder architecture...");
    }

    create() {
        this.scene.start('TitleScene');
    }
}