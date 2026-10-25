export class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
    }

    showBubble(x, y, text, duration = 2500) {
        const bubble = document.createElement('div');
        bubble.className = 'comic-bubble';
        bubble.innerText = text;
        
        const rect = this.scene.game.canvas.getBoundingClientRect();
        const screenX = rect.left + (x / this.scene.scale.width) * rect.width;
        const screenY = rect.top + (y / this.scene.scale.height) * rect.height;

        bubble.style.left = `${screenX}px`;
        bubble.style.top = `${screenY - 40}px`;
        document.body.appendChild(bubble);

        this.scene.time.delayedCall(duration, () => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        });
    }
}