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
        this.turnSpeed = 3;
        this.moveSpeed = 500;
        this.reverseSpeed = this.moveSpeed / 2;
        this.dragFactor = 0.1 // Lower is faster deceleration
             
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setGravity(0);
        this.setInteractive();

        this.body.useDamping = true;
        this.setDrag(this.dragFactor);
    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    moveLeft(x) {
        this.angle -= this.turnSpeed;
    }

    moveRight(x) {
        this.angle += this.turnSpeed;
    }

    moveForward(y) {
        const vec = this.scene.physics.velocityFromAngle(this.angle, this.moveSpeed);
        this.setVelocity(vec.x, vec.y);
    }

    stop(y) {
        // this.setVelocity(0);
        const vec = this.scene.physics.velocityFromAngle(this.angle, this.reverseSpeed);
        this.setVelocity(-vec.x, -vec.y);
    }
}