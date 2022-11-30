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

var keys;
var rectangle;
var graphics;
var isLooking = true;
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

        this.add.image(400, 300, 'background').setDepth(-100);
        this.coolometerBackground = this.add.image(725, 300, 'coolometer-background');
        this.coolometerForeground = this.add.image(725, 300, 'coolometer-foreground');
        this.coolometerForeground.setDepth(3);


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

        this.player = new Player(this, playerStart.x, playerStart.y, 'player');

        this.totalDistance = 0;

        this.exploder = new Exploder(this, 200, 200, 'exploder');

        this.exploder.startWave();
        explosionGroup = this.exploder.explosionGroup;

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
        this.exploder.blastTimer.paused = true;
    }

    addCoolometer() {
        graphics = this.add.graphics({ fillStyle: { color: 0x00ffff }});
        rectangle = new Phaser.Geom.Rectangle(
            this.coolometerForeground.getTopLeft().x,
            this.coolometerForeground.getTopLeft().y,
            this.coolometerForeground.width,
            this.coolometerForeground.height
            );
        coolometerCount = 0;
        coolometerMax = 500;

        const shape = this.make.graphics();
        shape.fillStyle(0xffffff);
        shape.beginPath();
        shape.fillRoundedRect(
            rectangle.x + 2,
            rectangle.y + 8,
            rectangle.width - 4,
            rectangle.height - 16,
            45
        );

        const mask = shape.createGeometryMask();
        graphics.setMask(mask);

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
            this.player.getTopCenter().x, this.player.getTopCenter().y,
            0, rayRange,
            rayRange, rayRange,
            rayRange / 2, 0,
            0x78e900, 0.25);

        sightcone.setDepth(-3);

        this.updateSightcone();
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
            this.player.reverse();
        }

        this.updateSightcone();

        //Add raycaster and map objects
        raycaster.mapGameObjects(explosionGroup.getChildren(), true);
        ray.setOrigin(this.player.getTopCenter().x, this.player.getTopCenter().y);
        ray.setAngleDeg(this.player.angle - 90);
        intersections = ray.castCone();
        raycaster.removeMappedObjects(explosionGroup.getChildren());

        //Draw lines if debug is true
        //Check type of object looked at
        rayGraphics.clear();
        let canSeeAnyExplosions = false;
        for (let intersection of intersections) {

            if (coneDebug === true) {
                let line = new Phaser.Geom.Line(ray.origin.x, ray.origin.y, intersection.x, intersection.y);
                rayGraphics.strokeLineShape(line);
            }

            if (intersection.object) {
                if (intersection.object.type === 'Arc') {
                    canSeeAnyExplosions = true;
                }
            }
        }
        isLooking = canSeeAnyExplosions;

        if (!isLooking && (coolometerCount < coolometerMax)){
            coolometerCount = Math.min(coolometerMax, coolometerCount + 0.3);
        }
        else if (isLooking && (coolometerCount > 0)){
            coolometerCount = Math.max(0, coolometerCount - 10);
        }

        // the higher up the coolometer we are the higher exponent we use
        if (this.score.shuffling) {
            this.score.setCombo(Math.pow(Math.floor(coolometerCount), 3) + 1);
        } else if (this.score.buzzing) {
            this.score.setCombo(Math.pow(Math.floor(coolometerCount), 2) + 1);
        } else {
            this.score.setCombo(Math.floor(coolometerCount) + 1);
        }
        this.score.incScore();

        // update coolometer
        graphics.clear();
        rectangle.setSize(100, coolometerCount);
        rectangle.y = 550 - coolometerCount;
        graphics.fillRectShape(rectangle);

        this.updateScoreTweens();

        this.updateAchievements();

        this.checkDeath();
    }

    updateSightcone() {
        sightcone.angle = this.player.angle - 180;
        sightcone.x = this.player.getTopCenter().x + ((rayRange / 2)*Math.cos((this.player.angle - 90) * (Math.PI/180)));
        sightcone.y = this.player.getTopCenter().y + ((rayRange / 2)*Math.sin((this.player.angle - 90) * (Math.PI/180)));
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
    //
    // Also (kinda hacky) update the exploder frequency to make the
    // game harder at higher coolness.
    updateScoreTweens() {
        if (!this.score.buzzing && coolometerCount > (coolometerMax * 0.5)) {
            this.score.enableBuzzing();
            this.exploder.blastWaveCount = 2;
        }
        if (this.score.buzzing && coolometerCount < (coolometerMax * 0.4)) {
            this.score.disableBuzzing();
            this.exploder.blastWaveCount = 1;
        }

        if (!this.score.shuffling && coolometerCount > (coolometerMax * 0.75)) {
            this.score.enableShuffling();
            this.exploder.blastWaveCount = 3;
        }
        if (this.score.shuffling && coolometerCount < (coolometerMax * 0.65)) {
            this.score.disableShuffling();
            this.exploder.blastWaveCount = 2;
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
        this.exploder.blastTimer.paused = true;
    }

    unpauseGame() {
        this.isRunning = true;
        this.physics.resume();
        this.tweens.resumeAll();
        this.unmuffleMusic();
        this.exploder.blastTimer.paused = false;
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

    checkDeath() {
        let touchingExplosion = false;
        explosionGroup.getChildren().forEach((e) => {
            let d = Math.sqrt(Math.pow(e.x - this.player.x, 2) + Math.pow(e.y - this.player.y, 2));
            if (d < e.radius) {
                touchingExplosion = true;
            }
        }, this);

        if (touchingExplosion) {
            this.endGame();
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
