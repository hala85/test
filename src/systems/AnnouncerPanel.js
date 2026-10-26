import { AnimatedActor } from '../entities/AnimatedActor.js';
import { ANNOUNCER_ANIMS } from '../config/assets.js';

const W = 238;
const H = 94;

// Small "side by side" announcer card in the bottom-left corner: portrait cell
// on the left, nameplate + one line of commentary on the right. Slides in for a
// few seconds, then gets out of the way.
export class AnnouncerPanel {
    constructor(scene, x = 14, y = 492) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.timer = 0;
        this.busy = false;

        this.container = scene.add.container(x, y).setDepth(150);

        const g = scene.add.graphics();
        g.fillStyle(0x0b0b14, 0.94);
        g.fillRoundedRect(0, 0, W, H, 10);
        g.lineStyle(3, 0xffe66d, 1);
        g.strokeRoundedRect(0, 0, W, H, 10);

        // portrait well
        g.fillStyle(0x1b1b2c, 1);
        g.fillRoundedRect(6, 6, 84, H - 12, 7);
        g.lineStyle(2, 0x2e2e46, 1);
        g.strokeRoundedRect(6, 6, 84, H - 12, 7);

        // "on air" dot
        g.fillStyle(0xff3355, 1);
        g.fillCircle(W - 16, 15, 4);

        this.label = scene.add.text(98, 11, 'THE ANNOUNCER', {
            fontFamily: 'Courier New, monospace',
            fontSize: '10px',
            color: '#ffe66d',
            fontStyle: 'bold'
        });

        this.body = scene.add.text(98, 26, '', {
            fontFamily: 'Courier New, monospace',
            fontSize: '11px',
            color: '#ffffff',
            wordWrap: { width: 128 },
            lineSpacing: 1
        });

        this.container.add([g, this.label, this.body]);
        this.container.setAlpha(0);

        this.actor = new AnimatedActor(scene, 'announcer', ANNOUNCER_ANIMS, x + 48, y + H - 9, 72);
        this.actor.sprite.setDepth(151).setAlpha(0);
        this.actor.play('idle');

        this.shown = false;
    }

    say(line, pose = 'talk', duration = 4200) {
        this.body.setText(line);
        this.actor.play(pose, true);
        this.timer = duration;

        if (!this.shown) {
            this.shown = true;
            this.container.x = this.x - 18;
            this.actor.x = this.container.x + 48;
            this.actor.place();

            this.scene.tweens.add({
                targets: this.container,
                x: this.x,
                duration: 240,
                ease: 'Back.easeOut'
            });
            this.scene.tweens.add({
                targets: [this.container, this.actor.sprite],
                alpha: 1,
                duration: 200
            });
        } else {
            this.scene.tweens.add({
                targets: [this.container, this.actor.sprite],
                alpha: 1,
                duration: 140
            });
        }
    }

    hide() {
        if (!this.shown) return;
        this.shown = false;
        this.scene.tweens.add({
            targets: [this.container, this.actor.sprite],
            alpha: 0,
            duration: 260
        });
    }

    update(dt) {
        this.actor.update(dt);
        // keep the portrait glued to the card while it slides
        this.actor.x = this.container.x + 48;
        this.actor.place();

        if (this.timer > 0) {
            this.timer -= dt * 1000;
            if (this.timer <= 0) this.hide();
        }
    }
}
