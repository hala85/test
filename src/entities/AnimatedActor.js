// ---------------------------------------------------------------------------
// AnimatedActor — draws one pose out of a spritesheet with per-frame, per-pose
// anchoring.
//
// The art in every sheet is hand drawn, so the figure sits differently inside
// each cell. If you just blit cell -> screen the character visibly jitters and
// "floats" or sinks between poses (that is the bug this class exists to kill).
//
// frames.json stores the opaque bounding box of every cell, so for each pose we
// know the exact pixel of the feet. We then place the sprite so THAT pixel lands
// on the actor's ground point. Jump, crouch, punch — the feet stay planted.
// ---------------------------------------------------------------------------

export class AnimatedActor {
    constructor(scene, sheet, anims, x, y, height) {
        this.scene = scene;
        this.anims = anims;
        this.x = x;
        this.y = y;
        this.facing = 1;

        this.standHeight = height;
        this.setSheet(sheet, height);

        this.sprite = scene.add.sprite(0, 0, sheet).setOrigin(0, 0);
        this.sprite.setScale(this.scaleFactor);

        this.current = null;
        this.frameList = [];
        this.framePos = 0;
        this.frameTimer = 0;
        this.frameIndex = 0;
        this.finished = false;
        this.looping = true;
        this.speed = 1;

        this.play(this.firstAnim(), true);
        this.place();
    }

    firstAnim() {
        if (this.anims.idle) return 'idle';
        return Object.keys(this.anims)[0];
    }

    setSheet(sheet, height) {
        const meta = this.scene.frameData[sheet];
        if (!meta) throw new Error(`No frames.json entry for sheet "${sheet}"`);
        this.sheet = sheet;
        this.meta = meta;
        this.scaleFactor = height / meta.frames[0].h;
        this._appliedFrame = -1;
        if (this.sprite) this.sprite.setTexture(sheet).setScale(this.scaleFactor);
    }

    play(name, force = false) {
        const anim = this.anims[name];
        if (!anim) return false;
        if (this.current === name && !force) return false;

        this.current = name;
        this.frameList = anim.frames;
        this.looping = anim.loop !== false;
        this.speed = (anim.fps || 8) / 10;
        this.hitAt = anim.hitAt;
        this.strikePending = false;
        this.framePos = 0;
        this.frameTimer = 0;
        this.finished = false;
        this.frameIndex = this.frameList[0];
        this.place();
        return true;
    }

    get frame() {
        return this.frameIndex;
    }

    update(dt) {
        if (!this.frameList.length) return;

        this.frameTimer += dt * 10 * this.speed;

        while (this.frameTimer >= 1) {
            this.frameTimer -= 1;

            if (this.framePos + 1 < this.frameList.length) {
                this.framePos++;
                this.frameIndex = this.frameList[this.framePos];
                if (this.hitAt === this.framePos) this.strikePending = true;
            } else if (this.looping) {
                this.framePos = 0;
                this.frameIndex = this.frameList[0];
            } else {
                this.finished = true;
                break;
            }
        }

        this.place();
    }

    place() {
        if (!this.sprite) return;
        const f = this.meta.frames[this.frameIndex] || this.meta.frames[0];
        const s = this.scaleFactor;
        const cellW = this.meta.cellW;

        const feetX = f.x + f.w / 2;
        const feetY = f.y + f.h;

        // push the current pose into the sprite (setTexture resets it to 0)
        if (this._appliedFrame !== this.frameIndex) {
            this.sprite.setFrame(this.frameIndex);
            this._appliedFrame = this.frameIndex;
        }

        const flip = this.facing < 0;
        this.sprite.setFlipX(flip);

        const drawX = flip ? cellW - feetX : feetX;
        this.sprite.x = this.x - drawX * s;
        this.sprite.y = this.y - feetY * s;

        // handy numbers for shadows / hit ranges
        this.contentW = f.w * s;
        this.contentH = f.h * s;
        this.contentBottom = this.y;
    }

    setDepth(d) {
        this.sprite.setDepth(d);
        return this;
    }
}
