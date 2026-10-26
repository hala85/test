import Phaser from 'phaser';
import { AnimatedActor } from './AnimatedActor.js';
import { CHARACTERS, STAND_HEIGHT } from '../config/assets.js';

const GRAVITY = 2000;
const JUMP_V = -700;
const SPEED = 220;

export class Fighter extends AnimatedActor {
    constructor(scene, x, y, characterKey, isPlayer = true, facing = 1) {
        const def = CHARACTERS[characterKey];
        super(scene, def.sheet, def.anims, x, y, STAND_HEIGHT);

        this.def = def;
        this.characterKey = characterKey;
        this.isPlayer = isPlayer;
        this.facing = facing;

        this.maxHealth = 100;
        this.health = 100;

        this.vx = 0;
        this.vy = 0;
        this.grounded = true;
        this.blocking = false;
        this.busy = false;
        this.down = false;          // lying on the mat
        this.ko = false;            // match-ending knocked out
        this.strikeConsumed = true;
        this.hurtLock = 0;
        this.downTimer = 0;
        this.groundY = y;

        this.sprite.setDepth(10);
        this.shadow = scene.add.ellipse(x, y + 2, 70, 16, 0x000000, 0.35).setDepth(9);
        this.place();
    }

    // -- state helpers ------------------------------------------------------

    consumeStrike() {
        if (!this.strikePending) return false;
        this.strikePending = false;
        return true;
    }

    get canAct() {
        return !this.busy && !this.down && !this.ko;
    }

    // Which way the opponent is; keeps the fighters squaring up like a real match.
    faceToward(otherX) {
        if (this.busy || this.down) return;
        this.facing = otherX >= this.x ? 1 : -1;
    }

    attack(kind) {
        if (!this.canAct || !this.grounded) return;
        const anim = this.def.anims[kind];
        if (!anim) return;
        this.busy = true;
        this.strikeConsumed = false;
        this.play(kind, true);
    }

    hurt(amount, fromX) {
        if (this.down || this.ko) return;
        if (this.blocking) amount = Math.ceil(amount * 0.3);
        this.health = Math.max(0, this.health - amount);
        this.vx = (this.x < fromX ? -1 : 1) * 160;
        this.hurtLock = 0.22;

        if (this.blocking) {
            // guarding eats most of the damage and never drops you
            this.busy = true;
            this.play('block', true);
            this.scene.time.delayedCall(180, () => {
                if (!this.down && !this.ko) {
                    this.busy = false;
                    this.blocking = false;
                    this.play('idle', true);
                }
            });
            return;
        }

        if (this.health <= 0) {
            this.knockout();
            return;
        }

        if (this.health <= 30 && Math.random() < 0.35) {
            this.knockdown();
            return;
        }

        this.busy = true;
        this.play('hurt', true);
        this.scene.time.delayedCall(220, () => {
            if (!this.down && !this.ko) {
                this.busy = false;
                this.play('idle', true);
            }
        });
    }

    // Physical knockdown that ends with him back on his feet.
    knockdown(duration = 2200) {
        if (this.down) return;
        this.enterMatted(duration);
    }

    knockout() {
        this.ko = true;
        this.enterMatted(999999);
        this.scene.onFighterKO(this);
    }

    // The important bit: the body actually lies on the mat, drawn from a
    // dedicated knocked-out pose, instead of a standing sprite rotated 90deg.
    enterMatted(duration) {
        this.down = true;
        this.busy = false;
        this.blocking = false;
        this.vx = 0;
        this.vy = 0;
        this.downTimer = duration;
        // the knocked-out art is a horizontal body, so pull it back inside the
        // ring instead of letting the head or boots hang off the apron
        this.x = Phaser.Math.Clamp(this.x, 150, 650);

        this.play('hurt', true);

        this.scene.time.delayedCall(160, () => {
            const koMeta = this.scene.frameData.knockout;
            const koScale = (this.standHeight * 1.18) / koMeta.frames[this.def.koFrame].w;
            this.sheet = 'knockout';
            this.meta = koMeta;
            this.scaleFactor = koScale;
            this.sprite.setTexture('knockout').setScale(koScale);
            this._appliedFrame = -1;
            this.frameIndex = this.def.koFrame;
            this.frameList = [this.def.koFrame];
            this.current = 'matted';
            this.facing = 1;                        // always head-left on the mat
            this.place();
            this.sprite.setDepth(8);
            this.shadow.setDepth(7);
            this.scene.dust(this.x, this.y, 14);
            this.scene.cameras.main.shake(140, 0.006);
        });

        this.shadow.setScale(1.6, 1);
    }

    getUp() {
        if (!this.down || this.ko) return;
        this.down = false;
        this.downTimer = 0;
        this.setSheet(this.def.sheet, STAND_HEIGHT);
        this.sprite.setDepth(10);
        this.shadow.setDepth(9).setScale(1, 1);
        this.busy = true;
        this.play('hurt', true);
        this.scene.dust(this.x, this.y, 6);
        this.scene.time.delayedCall(280, () => {
            this.busy = false;
            this.play('idle', true);
        });
    }

    // -- per frame ----------------------------------------------------------

    update(dt, input) {
        // knocked out / matted: no movement, no input, just lie there
        if (this.down) {
            if (this.downTimer > 0) {
                this.downTimer -= dt * 1000;
                if (this.downTimer <= 0) this.getUp();
            }
            this.syncShadow();
            return;
        }

        this.hurtLock = Math.max(0, this.hurtLock - dt);

        if (this.busy) {
            // attacks and reactions play out; light drift so it doesn't feel glued
            this.x += this.vx * dt;
            this.vx *= Math.pow(0.0015, dt);
            this.applyPhysics(dt);
            this.updateAnim(dt);
            this.syncShadow();
            return;
        }

        if (input) this.handleInput(dt, input);
        else this.handleAI(dt);

        this.applyPhysics(dt);
        this.updateAnim(dt);
        this.syncShadow();
    }

    handleInput(dt, input) {
        const speed = SPEED;
        if (input.left) {
            this.x -= speed * dt;
            this.facing = -1;
        } else if (input.right) {
            this.x += speed * dt;
            this.facing = 1;
        }

        this.x = Phaser.Math.Clamp(this.x, 80, 720);

        if (input.jump && this.grounded && this.canAct) {
            this.vy = JUMP_V;
            this.grounded = false;
        }

        if (!this.grounded) {
            this.play('idle');
            return;
        }

        if (input.attack && this.canAct) {
            const dist = Math.abs(this.x - input.opponentX);
            if (dist < 110) this.attack(Math.random() < 0.5 ? 'punch' : 'kick');
            else this.attack('punch');
            return;
        }

        this.blocking = !!input.block && this.grounded;
        if (this.blocking) {
            this.play('block');
            return;
        }

        if (input.left || input.right) this.play('walk');
        else this.play('idle');
    }

    handleAI(dt) {
        const foe = this.scene.opponent === this ? this.scene.player : this.scene.opponent;
        if (!foe || foe.ko || this.ko) {
            this.play('idle');
            return;
        }

        const dist = foe.x - this.x;
        const abs = Math.abs(dist);
        this.facing = dist >= 0 ? 1 : -1;

        this.aiTimer = (this.aiTimer || 0) - dt;

        if (abs > 105) {
            this.x += Math.sign(dist) * SPEED * 0.62 * dt;
            this.play('walk');
        } else {
            this.play('idle');
            if (this.aiTimer <= 0) {
                this.aiTimer = 0.7 + Math.random() * 0.9;
                if (foe.down) {
                    this.play('taunt', true);
                } else if (Math.random() < 0.72) {
                    this.attack(Math.random() < 0.5 ? 'punch' : 'kick');
                } else {
                    this.attack('slam');
                }
            }
        }

        this.x = Phaser.Math.Clamp(this.x, 80, 720);
    }

    applyPhysics(dt) {
        if (!this.grounded) {
            this.vy += GRAVITY * dt;
            this.y += this.vy * dt;
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.vy = 0;
                this.grounded = true;
                this.scene.dust(this.x, this.y, 5);
            }
        } else {
            this.groundY = this.y;
        }
    }

    updateAnim(dt) {
        super.update(dt);
        if (this.finished && this.busy && this.current !== 'victory') {
            this.busy = false;
            this.play('idle', true);
        }
    }

    syncShadow() {
        if (!this.shadow) return;
        this.shadow.x = this.x;
        this.shadow.y = this.y + 2;
        this.shadow.setScale(this.down ? 1.6 : Math.max(0.55, this.contentW / 90), 1);
        this.shadow.setAlpha(this.down ? 0.3 : 0.35);
    }
}
