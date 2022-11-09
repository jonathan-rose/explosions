import 'phaser';
import Score from '../Objects/Score';
import Player from '../Objects/Player';
import Exploder from '../Objects/Exploder';

var player;
var exploder;
var keys;
var rectangle;
var graphics;
var isLooking;
var coolometerCount;
var coolometerMax;
var sightcone;
var sightconeAngle;
var sightconeRotateSpeed;
var explosion;

export default class GameScene extends Phaser.Scene {

    constructor () {
        super('Game');
    }

    create () {
        this.add.image(400, 300, 'sky');
        this.add.image(700, 300, 'coolometer');

        // @TODO: currently not respecting whether the game sound is enabled
        this.sys.game.globals.music = this.sound.add(
            'music',
            {volume: 0.5,
             loop: true }
        );
        this.sys.game.globals.music.play();

        this.score = new Score(this);

        player = new Player(this, 100, 100, 'player');

        exploder = new Exploder(this, 200, 200, 'exploder');

        keys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'return': Phaser.Input.Keyboard.KeyCodes.SPACE, // Remove on release
            'x': Phaser.Input.Keyboard.KeyCodes.X,
        });

        graphics = this.add.graphics({ fillStyle: { color: 0x00ffff }});
        rectangle = new Phaser.Geom.Rectangle(650, 50, 100, 500);
        isLooking = true;
        coolometerCount = 0;
        coolometerMax = 500;

        sightcone = this.add.triangle(200, 200, 0, 148, 148, 148, 74, 0, 0x6666ff);
        sightconeAngle = 0;
        sightconeRotateSpeed = 0.2;
        sightcone.setInteractive();
        explosion.setInteractive();
        this.physics.add.overlap(sightcone, explosion, updateIsLooking); /////////////
        window.GameScene=this;
    }

    update () {

        graphics.clear();

        if (keys.left.isDown) {
            player.moveLeft();
        }

        if (keys.right.isDown) {
            player.moveRight();
        }

        if (keys.up.isDown) {
            player.moveForward();
            isLooking = true; // DELETE ME ONCE isLooking IS DONE
        }

        if (keys.down.isDown) {
            player.stop();
            isLooking = false; // DELETE ME ONCE isLooking IS DONE
        }

        if (keys.return.isDown) { // Remove on release
            player.setLocation(100, 100);
        }

        if (keys.x.isDown) { // Remove on release
            exploder.explode(100, 100);
        }

        if (isLooking && coolometerCount<coolometerMax){
            coolometerCount++;
        }
        else if (!isLooking && coolometerCount>0){
            coolometerCount--;
        }

        this.score.setCombo(coolometerCount);
        this.score.incScore();

        graphics.clear();
        rectangle.setSize(100, coolometerCount);
        rectangle.y = 550 - coolometerCount;
        graphics.fillRectShape(rectangle);

        sightcone.x = player.x;
        sightcone.y = player.y;
        Phaser.Math.RotateAroundDistance(sightcone, player.x, player.y, sightconeAngle, 120);
        const angleDeg = Math.atan2(sightcone.y - player.y, sightcone.x - player.x) * 180 / Math.PI;
        sightcone.angle = angleDeg+270;

        // if (sightcone.body.touching.none){
        //     sightcone.setFillStyle(0xff0000)
        // }

        // if(Phaser.Geom.Triangle.Contains(sightcone, explosion.x, explosion.y))
        // {
        //     isLooking = true;
        // }
        // else
        // {
        //     isLooking = false;
        // }

        if (isLooking){
            sightcone.setFillStyle(0xff0000);
        }
        else {
            sightcone.setFillStyle(0x6666ff);
        }

    }
};
