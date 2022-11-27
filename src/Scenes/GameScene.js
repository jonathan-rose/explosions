import 'phaser';
import Score from '../Objects/Score';
import Player from '../Objects/Player';
import Exploder from '../Objects/Exploder';
import OverlayManager from '../Overlays/OverlayManager';
import AchievementsOverlay from '../Overlays/AchievementsOverlay';
import CreditsOverlay from '../Overlays/CreditsOverlay';
import GameOverOverlay from '../Overlays/GameOverOverlay';
import PauseOverlay from '../Overlays/PauseOverlay';
import TitleOverlay from '../Overlays/TitleOverlay';

var exploder;
var keys;
var rectangle;
var graphics;
var isLooking;
var coolometerCount;
var coolometerMax;
var sightcone;
var explosionGroup;
var raycaster;
var ray;
var rayGraphics;
var intersections;
var playerStart;
var rayAngle = 50; // Need to make this determine by rayRange
var rayRange = 300; // Also determines sightcone size :)

var coneDebug = false;

export default class GameScene extends Phaser.Scene {

    constructor () {
        super('Game');
    }

    create () {
        this.isRunning = true;
        this.model = this.sys.game.globals.model;
        playerStart = new Phaser.Math.Vector2(this.cameras.main.width/ 2, this.cameras.main.height / 2);

        this.add.image(400, 300, 'sky').setDepth(-100);
        this.add.image(700, 300, 'coolometer');

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

        player = new Player(this, playerStart.x, playerStart.y, 'player');

        this.totalDistance = 0;

        exploder = new Exploder(this, 200, 200, 'exploder');

        exploder.startWave();
        explosionGroup = exploder.explosionGroup;

        keys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });

        this.addRaycaster();
        this.addCoolometer();
        this.addSightcone();
        this.initOverlays();

        // game should start paused with the title overlay open
        this.overlayManager.openTarget('title'); // Changed for testing
        this.isRunning = false;
        exploder.blastTimer.paused = true;
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
            'achievements': new AchievementsOverlay(this),
            'credits': new CreditsOverlay(this),
            'gameOver': new GameOverOverlay(this),
            'pause': new PauseOverlay(this),
            'title': new TitleOverlay(this)
        };
        this.overlayManager = new OverlayManager(this, overlayMap);
    }


    addSightcone() {
        sightcone = this.add.triangle(
            player.getTopCenter().x, player.getTopCenter().y,
            0, rayRange,
            rayRange, rayRange,
            rayRange / 2, 0,
            0xDFAF15, 0.15);
        
        sightcone.setDepth(-3);
    }

    addRaycaster() {
        raycaster = this.raycasterPlugin.createRaycaster();
        ray = raycaster.createRay();
        ray.enablePhysics();
        ray.setConeDeg(rayAngle);
        ray.setRayRange(rayRange);
        rayGraphics = this.add.graphics({ 
            lineStyle: { width: 1, color: 0x00ff00}, 
            fillStyle: { color: 0xff00ff } 
        });
    }

    update () {
        // this might be too heavy handed as a pause mechanism
        if (!this.isRunning) { return; }

        graphics.clear();

        if (keys.left.isDown) {
            this.player.moveLeft();
        }

        if (keys.right.isDown) {
            this.player.moveRight();
        }

        if (keys.up.isDown) {
            this.player.moveForward();
        }

        if (keys.down.isDown) {
            player.reverse();
        }

        if (isLooking && coolometerCount<coolometerMax){
            coolometerCount++;
        }
        else if (!isLooking && coolometerCount>0){
            coolometerCount--;
        }

        this.score.setCombo(Math.pow(coolometerCount, 3) + 1);
        this.score.incScore();

        // update coolometer
        graphics.clear();
        rectangle.setSize(100, coolometerCount);
        rectangle.y = 550 - coolometerCount;
        graphics.fillRectShape(rectangle);

        //update sightcone
        sightcone.angle = player.angle - 180;
        sightcone.x = player.getTopCenter().x + ((rayRange / 2)*Math.cos((player.angle - 90) * (Math.PI/180)));
        sightcone.y = player.getTopCenter().y + ((rayRange / 2)*Math.sin((player.angle - 90) * (Math.PI/180)));

        //Add raycaster and map objects
        raycaster.mapGameObjects(explosionGroup.getChildren(), true);
        ray.setOrigin(player.getTopCenter().x, player.getTopCenter().y);
        ray.setAngleDeg(player.angle - 90);
        intersections = ray.castCone();
        raycaster.removeMappedObjects(explosionGroup.getChildren());

        //Draw lines if debug is true
        //Check type of object looked at
        rayGraphics.clear();
        for (let intersection of intersections) {

            if (coneDebug === true) {
                let line = new Phaser.Geom.Line(ray.origin.x, ray.origin.y, intersection.x, intersection.y);
                rayGraphics.strokeLineShape(line);
            }

            if (intersection.object) {
                if (intersection.object.type === 'Arc') {
                    isLooking = false;
                }
                } else {
                    isLooking = true;
            }
        }

        this.updateScoreTweens();

        this.updateAchievements();
    }

    unlockAchievement(name) {
        this.model._achievements[name].unlocked = true;
        this.overlayManager.overlayMap['achievements'].updateAchievements();
    }

    updateAchievements() {
        // lookedAtExplosion1
        if (isLooking) {
            this.unlockAchievement('lookedAtExplosion1');
        }

        // lookedAtExplosion2
        // @NOTE: this doesn't work properly if they start the game by
        // hitting ESC from the title overlay, not worth fixing
        if (isLooking && (Date.now() - this.gameStartTime) <= 2000) {
            this.unlockAchievement('lookedAtExplosion2');
        }

        // distanceWalked
        this.totalDistance += this.player.body.speed;
        // arbitrary long distance to represent 500 miles
        if (this.totalDistance > 5000000) {
            this.unlockAchievement('distanceWalked');
        }

        // highScore1
        if (this.score.currentScore > 1000000) {
            this.unlockAchievement('highScore1');
        }

        // highScore2
        if (this.score.currentScore > 1000000000) {
            this.unlockAchievement('highScore2');
        }

        // highScore3
        if (this.score.currentScore > 1000000000000) {
            this.unlockAchievement('highScore3');
        }

        // maxCool
        if (coolometerCount == coolometerMax) {
            this.unlockAchievement('maxCool');
        }

        // stayCool
        if (coolometerCount == coolometerMax) {
            if (this.maxCoolTime == null) {
                this.maxCoolTime = Date.now();
            } else {
                // @NOTE: you can cheat by pausing while at max cool,
                // not worth fixing
                if (Date.now() - this.maxCoolTime > 30000) {
                    this.unlockAchievement('stayCool');
                }
            }
        } else {
            this.maxCoolTime = null;
        }
    }

    // If we go above 50% cool enable the buzzing tween, if above 75%
    // cool also enable the shuffling tween. Use respectively lower
    // percentages to turn tweens off in order to debounce.
    updateScoreTweens() {
        if (coolometerCount > (coolometerMax * 0.5)) {
            this.score.enableBuzzing();
        }
        if (coolometerCount < (coolometerMax * 0.4)) {
            this.score.disableBuzzing();
        }

        if (coolometerCount > (coolometerMax * 0.75)) {
            this.score.enableShuffling();
        }
        if (coolometerCount < (coolometerMax * 0.65)) {
            this.score.disableShuffling();
        }
    }

    muffleMusic() {
        this.sys.game.globals.music.volume = 0;
        this.sys.game.globals.musicMuffled.volume = 0.3;
    }

    unmuffleMusic() {
        this.sys.game.globals.music.volume = 0.5;
        this.sys.game.globals.musicMuffled.volume = 0;
    }

    pauseGame() {
        this.isRunning = false;
        this.physics.pause();
        this.tweens.pauseAll();
        this.overlayManager.unpauseAllCursorTweens();
        this.muffleMusic();
        exploder.blastTimer.paused = true;
    }

    unpauseGame() {
        this.isRunning = true;
        this.physics.resume();
        this.tweens.resumeAll();
        this.unmuffleMusic();
        exploder.blastTimer.paused = false;
    }

    // handle pausing/unpausing the game
    escHandler(keyEvent) {
        if (this.overlayManager.overlayStack.length == 0) {
            this.pauseGame();
            this.overlayManager.openTarget('pause');
        } else {
            this.overlayManager.disableTop();
            if (this.overlayManager.overlayStack.length == 0) {
                this.unpauseGame();
            }
        }
    }

    // the player has died, go to the gameOver overlay
    endGame() {
        this.model._currentScore = this.score.currentScore;
        this.pauseGame();
        this.overlayManager.openTarget('gameOver');
        // @NOTE: this is a little bit icky, ideally it would be nice
        // if overlays had onOpen and onClose methods they could
        // override to do stuff like this. Too much work for now.
        this.overlayManager.overlayMap['gameOver'].updateScore();
    }

    restartGame() {
        this.player.setVelocity(0);
        this.player.setRotation(0);
        this.player.setLocation(100, 100);
        this.score.resetCombo();
        this.score.resetScore();
        coolometerCount = 0;
        this.gameStartTime = Date.now();

        // @TODO: add whatever is required to reset explosions
    }
};
