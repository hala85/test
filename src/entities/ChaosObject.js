export class ChaosObject {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        
        const startX = Math.random() > 0.5 ? 50 : 750;

        this.sprite = scene.add.rectangle(startX, 350, 40, 40, type === 'cheeseburger' ? 0xffff00 : 0xff0000);
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setVelocityX(startX < 400 ? 150 : -150);

        scene.tweens.add({
            targets: this.sprite,
            y: 400,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        scene.time.delayedCall(6000, () => {
            if (this.sprite && this.sprite.active) {
                this.sprite.destroy();
            }
        });
    }
}