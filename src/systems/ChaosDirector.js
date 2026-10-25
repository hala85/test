import { ChaosObject } from '../entities/ChaosObject.js';

export class ChaosDirector {
    constructor(scene) {
        this.scene = scene;
        this.timer = 0;
        this.interval = 8000;
    }

    update(time, delta) {
        this.timer += delta;
        if (this.timer > this.interval) {
            this.timer = 0;
            this.triggerRandomEvent();
        }
    }

    triggerRandomEvent() {
        const events = ['cheeseburger', 'pizza_box', 'flying_fish', 'ref_distraction'];
        const chosen = Phaser.Math.RND.pick(events);

        if (chosen === 'cheeseburger' || chosen === 'pizza_box' || chosen === 'flying_fish') {
            new ChaosObject(this.scene, chosen);
        } else if (chosen === 'ref_distraction') {
            this.scene.announcerDialogue("THE REF WAS LOOKING RIGHT AT IT!");
        }
    }
}