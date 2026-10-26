import { ChaosObject } from '../entities/ChaosObject.js';

const EVENTS = ['cheeseburger', 'pizza_box', 'flying_fish', 'ref_distraction'];

// Runs the random mayhem while a match is live.
export class ChaosDirector {
    constructor(scene, interval = 9000) {
        this.scene = scene;
        this.timer = 4000;         // first bit of chaos lands a few seconds in
        this.interval = interval;

        if (!scene.chaosObjects) scene.chaosObjects = [];
        scene.chaosObjects.forEach(o => o.destroy());
        scene.chaosObjects.length = 0;
    }

    update(time, delta) {
        this.timer += delta;
        if (this.timer > this.interval) {
            this.timer = 0;
            this.interval = 8000 + Math.random() * 6000;
            this.triggerRandomEvent();
        }

        this.scene.chaosObjects.forEach(o => o.update(delta / 1000));
    }

    triggerRandomEvent() {
        const chosen = EVENTS[Math.floor(Math.random() * EVENTS.length)];

        if (chosen === 'ref_distraction') {
            this.scene.refDistraction();
            this.scene.announcerDialogue('THE REF WAS LOOKING RIGHT AT IT!');
        } else {
            new ChaosObject(this.scene, chosen);
            if (Math.random() < 0.5) {
                this.scene.announcerDialogue('WHO THREW THAT?!');
            }
        }
    }
}
