import 'phaser';

export default class OverlayManager {
    constructor(scene, overlayMap) {
        this.scene = scene;
        this.overlayMap = overlayMap;
        this.overlayStack = [];

        this.keys = this.scene.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'enter': Phaser.Input.Keyboard.KeyCodes.ENTER,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.keys['up'].on('down', this.upHandler, this);
        this.keys['down'].on('down', this.downHandler, this);
        this.keys['enter'].on('down', this.navHandler, this);
        this.keys['space'].on('down', this.navHandler, this);

    }

    openTarget(target) {
        if (this.overlayStack.length > 0) {
            this.overlayStack[this.overlayStack.length - 1].disable();
        }
        this.overlayMap[target].enable();
        this.overlayStack.push(this.overlayMap[target]);
    }

    disableTop() {
        this.overlayStack.pop().disable();

        if (this.overlayStack.length > 0) {
            this.overlayStack[this.overlayStack.length - 1].enable();
        } else {
            this.scene.unpauseGame();
        }
    }

    disableAll() {
        this.overlayStack.forEach((o) => {
            o.disable();
        });
        this.overlayStack = [];
        this.scene.unpauseGame();
    }

    upHandler() {
        if (this.overlayStack.length == 0) { return; }
        this.overlayStack[this.overlayStack.length - 1].upHandler();
    }

    downHandler() {
        if (this.overlayStack.length == 0) { return; }
        this.overlayStack[this.overlayStack.length - 1].downHandler();
    }

    navHandler() {
        if (this.overlayStack.length == 0) { return; }
        this.overlayStack[this.overlayStack.length - 1].navHandler();
    }

    // little bit of a hack so we can 'pauseAll()' tweens when we
    // pause the game, then unpause the cursor blinking tweens for the
    // overlays.
    unpauseAllCursorTweens() {
        for (let [name, o] of Object.entries(this.overlayMap)) {
            o.cursorBlink.resume();
        }
    }
}
