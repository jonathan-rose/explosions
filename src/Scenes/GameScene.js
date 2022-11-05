import 'phaser';
import Player from '../Objects/Player';

var player;
var keys;

export default class GameScene extends Phaser.Scene {
    constructor () {
        super('Game');
    }

    create () {
        this.add.image(400, 300, 'sky');
        player = new Player(this, 50, 50, 'player');
        
        keys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });

        
    }

    update () {
        if (keys.left.isDown) {
            player.moveLeft(1);
        }

        if (keys.right.isDown) {
            player.moveRight(1);
        }
        
        if (keys.up.isDown) {
            player.moveUp(1);
        }
        
        if (keys.down.isDown) {
            player.moveDown(1);
        }
    }
};
