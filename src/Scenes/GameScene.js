import 'phaser';
import Button from '../Objects/Button';
import Player from '../Objects/Player';

export default class GameScene extends Phaser.Scene {
    constructor () {
        super('Game');
    }

    create () {
        this.add.image(400, 300, 'sky');

        var particles = this.add.particles('green');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);

        var player = new Player(this, 50, 50, 'player');
    }

    update () {

    }
};
