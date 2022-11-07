import 'phaser';
import Score from '../Objects/Score';
import Player from '../Objects/Player';

var player;
var keys;
var rectangle;
var graphics;
var isLooking;
var coolometerCount;
var coolometerMax;
var sightcone;
var sightconeAngle;

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

        player = new Player(this, 50, 50, 'player');

        keys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });

        graphics = this.add.graphics({ fillStyle: { color: 0x00ffff }});
        rectangle = new Phaser.Geom.Rectangle(650, 50, 100, 500);
        isLooking = true;
        coolometerCount = 0;
        coolometerMax = 500;

        sightcone = this.add.triangle(200, 200, 0, 148, 148, 148, 74, 0, 0x6666ff);
        sightconeAngle = 0;
    }

    update () {
        if (keys.left.isDown) {
            player.moveLeft(1);
            sightconeAngle -= 0.2;
        }

        if (keys.right.isDown) {
            player.moveRight(1);
            sightconeAngle += 0.2;
        }

        if (keys.up.isDown) {
            player.moveUp(1);
            isLooking = true; // DELETE ME ONCE isLooking IS DONE
        }

        if (keys.down.isDown) {
            player.moveDown(1);
            isLooking = false; // DELETE ME ONCE isLooking IS DONE
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
        //Phaser.Math.RotateAround(sightcone, player.center, 0.01);
    }
};
