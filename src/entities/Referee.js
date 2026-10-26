import Phaser from 'phaser';
import { AnimatedActor } from './AnimatedActor.js';
import { REF_ANIMS } from '../config/assets.js';

// The ref hangs out at the back of the ring, watches the match, runs over and
// counts whenever somebody is flat on the mat, and reacts when the chaos
// director distracts her.
export class Referee extends AnimatedActor {
    constructor(scene, x, y) {
        super(scene, 'referee', REF_ANIMS, x, y, 118);
        this.sprite.setDepth(4);
        this.shadow = scene.add.ellipse(x, y + 2, 56, 13, 0x000000, 0.28).setDepth(3);
        this.homeX = x;
        this.mode = 'idle';
        this.timer = 0;
        this.targetX = x;
        this.play('idle');
        this.syncShadow();
    }

    runTo(x) {
        this.targetX = Phaser.Math.Clamp(x + 46, 110, 690);
        this.mode = 'run';
        this.play('run', true);
    }

    count() {
        this.mode = 'count';
        this.play('count', true);
    }

    declare() {
        this.mode = 'declare';
        this.play('declare', true);
    }

    distract(seconds = 2.2) {
        this.mode = 'distracted';
        this.timer = seconds;
        this.play('facepalm', true);
    }

    cheer() {
        this.mode = 'cheer';
        this.play('cheer', true);
    }

    update(dt) {
        this.timer -= dt;

        if (this.mode === 'run') {
            const d = this.targetX - this.x;
            this.facing = d >= 0 ? 1 : -1;
            if (Math.abs(d) < 6) {
                this.x = this.targetX;
                this.mode = 'waiting';
                this.play('idle', true);
            } else {
                this.x += Math.sign(d) * 260 * dt;
            }
        } else if (this.mode === 'distracted' && this.timer <= 0) {
            this.mode = 'idle';
            this.play('idle', true);
        } else if (this.mode === 'declare' && this.finished) {
            this.play('declare', true);
        } else if (this.mode === 'waiting') {
            // nothing, waiting for instructions from the scene
        } else {
            // drift back toward the middle of the ring when idle
            const d = this.homeX - this.x;
            if (Math.abs(d) > 120 && this.mode === 'idle') {
                this.x += Math.sign(d) * 40 * dt;
                this.play('walk');
            }
        }

        this.updateAnim(dt);
        this.syncShadow();
    }

    updateAnim(dt) {
        super.update(dt);
        if (this.finished && (this.mode === 'idle' || this.mode === 'distracted')) {
            this.play('idle', true);
        }
    }

    syncShadow() {
        if (!this.shadow) return;
        this.shadow.x = this.x;
        this.shadow.y = this.y + 2;
    }

    place() {
        super.place();
        this.syncShadow();
    }
}
