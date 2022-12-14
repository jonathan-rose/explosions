import 'phaser';
import Utils from '../Utils';

export default class Overlay extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        let {width, height} = scene.sys.game.scale.gameSize;
        this.width = width;
        this.height = height;
        this.centerX = width / 2;
        this.x = 0;
        this.y = 0;

        // default y-offset for navs, feel free to overwrite
        this.yOffset = 200;

        this.alphaLayer = this.scene.add.rectangle(
            0,
            0,
            width,
            height,
            0,
            0.7
        ).setOrigin(0);

        this.add(this.alphaLayer);

        // overlays should be off by default
        this.disable();

        this.setDepth(10);
        this.scene.add.existing(this);

        // default nav goes back to previous overlay
        this.navData = [
            {text: 'back',
             action: 'CLOSE_OVERLAY'}
        ];
    }

    enable() {
        this.visible = true;
    }

    disable() {
        this.visible = false;
    }

    // Child classes should call this at the end of their constructor
    // to create the navigation options
    initNavs() {
        if (this.navData.length == 0) { return; }

        this.navs = [];

        // create a text object for each item in the navData array
        let i = 0;
        this.navData.forEach((nd) => {
            let n = this.scene.add.text(
                this.centerX,
                this.yOffset + (i * 100),
                nd.text,
                {fontSize: '32px',
                 fill: '#FFF'}
            ).setOrigin(0.5);
            this.navs.push(n);
            this.add(n);
            i++;
        }, this);

        // create the '>> <<' cursor
        this.cursorPos = 0;
        this.cursor = this.scene.add.text(
            this.centerX,
            this.yOffset,
            '>>             <<',
            {fontSize: '32px',
             fill: '#FFF'}
        ).setOrigin(0.5);
        this.add(this.cursor);

        this.cursorBlink = this.scene.tweens.add({
            targets: this.cursor,
            alpha: 0,
            yoyo: true,
            duration: 200,
            repeat: -1
        });
    }

    upHandler() {
        this.cursorPos = Utils.mod((this.cursorPos - 1), this.navs.length);
        this.cursor.y = this.yOffset + (this.cursorPos * 100);
    }

    downHandler() {
        this.cursorPos = Utils.mod((this.cursorPos + 1), this.navs.length);
        this.cursor.y = this.yOffset + (this.cursorPos * 100);
    }

    navHandler() {
        let {text, action, target, extras} = this.navData[this.cursorPos];
        switch(action) {
        case 'CLOSE_OVERLAY':
            this.scene.overlayManager.disableTop();
            break;
        case 'OPEN_OVERLAY':
            this.scene.overlayManager.openTarget(target);
            break;
        case 'RESTART_GAME':
            this.scene.overlayManager.disableAll();
            this.scene.restartGame();
            break;
        }

        if (extras != null && extras.includes('RESET_GAME_START_TIMER')) {
            this.scene.gameStartTimer = Date.now();
        }
    }
}
