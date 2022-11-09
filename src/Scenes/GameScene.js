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
            {volume: 0.0, //Temporarily disabled music
             loop: true }
        );
        this.sys.game.globals.music.play();

        this.score = new Score(this);

        player = new Player(this, 100, 100, 'player');

        keys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'return': Phaser.Input.Keyboard.KeyCodes.SPACE, // Remove on release
        });

        graphics = this.add.graphics({ fillStyle: { color: 0x00ffff }});
        rectangle = new Phaser.Geom.Rectangle(650, 50, 100, 500);
        isLooking = true;
        coolometerCount = 0;
        coolometerMax = 500;
    }

    update () {
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
    }
};
