import 'phaser';
import GameScene from '../Scenes/GameScene';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.setCollideWorldBounds = true;
        this.turnSpeed = 5;
        this.moveSpeed = 500;
        this.reverseSpeed = this.moveSpeed / 3;
        this.dragFactor = 0.1; // Lower is faster deceleration

        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setGravity(0);
        this.setInteractive();

        this.body.setCollideWorldBounds(true);
        this.body.setBounce(0.3, 0.3);

        this.body.useDamping = true;
        this.setDrag(this.dragFactor);
    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    moveLeft() {
        this.angle -= this.turnSpeed;
    }

    moveRight() {
        this.angle += this.turnSpeed;
    }

    moveForward() {
        const vec = this.scene.physics.velocityFromAngle(this.angle, this.moveSpeed);
        this.setVelocity(vec.y, -vec.x);
    }

    reverse() {
        const vec = this.scene.physics.velocityFromAngle(this.angle, this.reverseSpeed);
        this.setVelocity(-vec.y, vec.x);
    }

    quickturn() {
        this.angle += 180;
    }
}
