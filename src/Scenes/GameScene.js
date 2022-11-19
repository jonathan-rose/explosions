import 'phaser';
import Score from '../Objects/Score';
import Player from '../Objects/Player';
import Exploder from '../Objects/Exploder';
import OverlayManager from '../Overlays/OverlayManager';
import PauseOverlay from '../Overlays/PauseOverlay';
import CreditsOverlay from '../Overlays/CreditsOverlay';

var player;
var exploder;
var keys;
var rectangle;
var graphics;
var isLooking;
var coolometerCount;
var coolometerMax;
var sightcone;
var testCircle;

export default class GameScene extends Phaser.Scene {

    constructor () {
        super('Game');
    }

    create () {
        this.isRunning = true;

        this.add.image(400, 300, 'sky');
        this.add.image(700, 300, 'coolometer');

        // @TODO: currently not respecting whether the game sound is enabled
        this.sys.game.globals.music = this.sound.add(
            'music',
            {volume: 0.5,
             loop: true}
        );
        this.sys.game.globals.music.play();

        // play a second copy of the music which has been modified to sound muffled (volume 0 to start)
        this.sys.game.globals.musicMuffled = this.sound.add(
            'musicMuffled',
            {volume: 0,
             loop: true}
        );
        this.sys.game.globals.musicMuffled.play();

        this.score = new Score(this);

        player = new Player(this, 100, 100, 'player');

        exploder = new Exploder(this, 200, 200, 'exploder');

        // exploder.startWave();

        keys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'return': Phaser.Input.Keyboard.KeyCodes.SPACE, // Remove on release
            'x': Phaser.Input.Keyboard.KeyCodes.X, // Remove on release
        });

        // window.GameScene=this; - Is this important? I think I added this and its useless - Jon

        this.addCoolometer();
        this.addSightcone();
        this.initOverlays();

        testCircle = this.add.circle(400, 450, 100, 0x6666ff);

        this.physics.add.existing(sightcone);
        this.physics.add.existing(testCircle);
        this.physics.add.overlap(sightcone, testCircle);
    }

    addCoolometer() {
        graphics = this.add.graphics({ fillStyle: { color: 0x00ffff }});
        rectangle = new Phaser.Geom.Rectangle(650, 50, 100, 500);
        coolometerCount = 0;
        coolometerMax = 500;

        this.escKey = this.input.keyboard.addKey('ESC');
        this.escKey.on('down', this.escHandler, this);
    }

    initOverlays() {
        let overlayMap = {
            'pause': new PauseOverlay(this),
            'credits': new CreditsOverlay(this)
            // @TODO: register the other overlays here
        };
        this.overlayManager = new OverlayManager(this, overlayMap);
    }


    addSightcone() {
        sightcone = this.add.triangle(200, 200, 0, 148, 148, 148, 74, 0, 0x6666ff);

        // planning on extending or swapping for sprites

        // sightcone = new Phaser.Geom.Triangle(0, 148, 148, 148, 74, 0);
        // var graphics2 = this.add.graphics({ fillStyle: { color: 0x00ffff }});
        // graphics2.fillTriangleShape(sightcone);
    }

    update () {
        // this might be too heavy handed as a pause mechanism
        if (!this.isRunning) { return; }

        graphics.clear();

        if (keys.left.isDown) {
            player.moveLeft();
        }

        if (keys.right.isDown) {
            player.moveRight();
        }

        if (keys.up.isDown) {
            player.moveForward();
        }

        if (keys.down.isDown) {
            player.stop();
        }

        if (keys.return.isDown) { // Remove on release
            player.setLocation(100, 100);
        }

        if (keys.x.isDown) { // Remove on release
            exploder.stopWave();
        }

        if (isLooking && coolometerCount<coolometerMax){
            coolometerCount++;
        }
        else if (!isLooking && coolometerCount>0){
            coolometerCount--;
        }

        this.score.setCombo(coolometerCount + 1);
        this.score.incScore();

        // update coolometer
        graphics.clear();
        rectangle.setSize(100, coolometerCount);
        rectangle.y = 550 - coolometerCount;
        graphics.fillRectShape(rectangle);

        //update sightcone
        sightcone.angle = player.angle -90;
        sightcone.x = player.x + (120*Math.cos(player.angle * (Math.PI/180)));
        sightcone.y = player.y + (120*Math.sin(player.angle * (Math.PI/180)));

        if (isLooking){
            sightcone.setFillStyle(0xff0000);
        }
        else {
            sightcone.setFillStyle(0x6666ff);
        }

        isLooking = (this.physics.overlap(sightcone, testCircle));
    }

    testFunction() {
        console.log("Hit");
    }

    muffleMusic() {
        this.sys.game.globals.music.volume = 0;
        this.sys.game.globals.musicMuffled.volume = 0.3;
    }

    unmuffleMusic() {
        this.sys.game.globals.music.volume = 0.5;
        this.sys.game.globals.musicMuffled.volume = 0;
    }

    // handle pausing/unpausing the game
    escHandler(keyEvent) {
        if (this.overlayManager.overlayStack.length == 0) {
            this.isRunning = false;
            this.physics.pause();
            this.overlayManager.enablePause();
            this.muffleMusic();
        } else {
            this.overlayManager.disableTop();
            if (this.overlayManager.overlayStack.length == 0) {
                this.unmuffleMusic();
                this.isRunning = true;
                this.physics.resume();
            }
        }
    }
};
