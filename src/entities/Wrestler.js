export class Wrestler {
    constructor(scene, x, y, characterKey, isPlayer = true) {
        this.scene = scene;
        this.characterKey = characterKey;
        this.isPlayer = isPlayer;
        this.health = 100;
        this.stamina = 100;
        this.isDown = false;

        this.container = scene.add.container(x, y);
        this.bodyRect = scene.add.rectangle(0, 0, 50, 90, isPlayer ? 0x00ffcc : 0xff3333);
        this.label = scene.add.text(-25, -55, characterKey.toUpperCase(), { fontSize: '12px', fill: '#fff' });
        
        this.container.add([this.bodyRect, this.label]);
        scene.physics.add.existing(this.container);
        this.container.body.setCollideWorldBounds(true);
        this.container.body.setGravityY(800);
        this.container.body.setSize(50, 90);
    }

    update(cursors, keys) {
        if (this.isDown) return;

        const speed = 200;
        if (this.isPlayer) {
            if (cursors.left.isDown) {
                this.container.body.setVelocityX(-speed);
            } else if (cursors.right.isDown) {
                this.container.body.setVelocityX(speed);
            } else {
                this.container.body.setVelocityX(0);
            }

            if (cursors.up.isDown && this.container.body.blocked.down) {
                this.container.body.setVelocityY(-450);
            }

            if (Phaser.Input.Keyboard.JustDown(keys.attack)) {
                this.attack();
            }
        }
    }

    attack() {
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1.2,
            scaleY: 0.8,
            duration: 100,
            yoyo: true
        });
    }

    takeDamage(amount) {
        this.health -= amount;
        this.scene.tweens.add({
            targets: this.bodyRect,
            fillColor: 0xffffff,
            duration: 50,
            yoyo: true
        });

        if (this.health <= 0) {
            this.knockdown();
        }
    }

    knockdown() {
        this.isDown = true;
        this.container.body.setVelocityX(0);
        this.scene.tweens.add({
            targets: this.container,
            rotation: Math.PI / 2,
            y: 480,
            duration: 300
        });
    }
}