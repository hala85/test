import { Wrestler } from '../entities/Wrestler.js';
import { ChaosDirector } from '../systems/ChaosDirector.js';
import { DialogueSystem } from '../systems/DialogueSystem.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.playerKey = data.playerChar || 'cat_lady';
        this.opponentKey = data.opponentChar || 'wrangler';
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
        this.add.rectangle(400, 480, 750, 120, 0x3b3b58);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            pause: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        };

        this.player = new Wrestler(this, 250, 420, this.playerKey, true);
        this.opponent = new Wrestler(this, 550, 420, this.opponentKey, false);

        this.chaosDirector = new ChaosDirector(this);
        this.dialogueSystem = new DialogueSystem(this);

        this.playerHealthText = this.add.text(30, 30, `P1 HP: 100`, { fontSize: '18px', fill: '#00ffcc' });
        this.opponentHealthText = this.add.text(550, 30, `CPU HP: 100`, { fontSize: '18px', fill: '#ff3333' });

        this.dialogueSystem.showBubble(400, 150, "DING DING DING! LET'S GET READY TO BONK!");
    }

    update(time, delta) {
        this.player.update(this.cursors, this.keys);
        this.chaosDirector.update(time, delta);

        this.playerHealthText.setText(`P1 HP: ${Math.max(0, this.player.health)}`);
        this.opponentHealthText.setText(`CPU HP: ${Math.max(0, this.opponent.health)}`);

        if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
            this.scene.launch('PauseScene');
            this.scene.pause();
        }
    }

    announcerDialogue(text) {
        this.dialogueSystem.showBubble(400, 180, text);
    }
}