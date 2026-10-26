import Phaser from 'phaser';

const LOOKS = {
    cheeseburger: { emoji: '\u{1F354}', tint: 0xffc24b },
    pizza_box:    { emoji: '\u{1F355}', tint: 0xff8a3d },
    flying_fish:  { emoji: '\u{1F41F}', tint: 0x6fd3ff }
};

// A bit of chaos that sails across the ring. Cheap and readable: an emoji
// coin that arcs over the mat, then disappears.
export class ChaosObject {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;

        const look = LOOKS[type] || LOOKS.cheeseburger;
        const fromLeft = Math.random() > 0.5;

        this.x = fromLeft ? -40 : 840;
        this.y = Phaser.Math.Between(250, 330);
        this.vx = fromLeft ? 190 : -190;
        this.vy = -140;

        this.container = scene.add.container(this.x, this.y).setDepth(30);
        this.container.add(scene.add.circle(0, 0, 19, look.tint, 0.95).setStrokeStyle(3, 0x1b1730));
        this.container.add(scene.add.text(0, 0, look.emoji, { fontSize: '22px' }).setOrigin(0.5));

        this.alive = true;
        scene.chaosObjects.push(this);

        scene.time.delayedCall(6500, () => this.destroy());
    }

    update(dt) {
        this.vy += 420 * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.y > 470) {
            this.y = 470;
            this.vy *= -0.45;
            this.vx *= 0.7;
        }

        this.container.setPosition(this.x, this.y);
        this.container.rotation += dt * 3;

        if (this.x < -80 || this.x > 880) this.destroy();
    }

    destroy() {
        if (!this.alive) return;
        this.alive = false;
        this.container.destroy();
    }
}
