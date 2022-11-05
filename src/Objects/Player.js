import 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.setCollideWorldBounds = true;

        console.log(this);
        
        //setInteractive can have a hitarea specified as an argument.
        //update this with the geometry of the sprite.
        this.setInteractive();
        
        // this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    moveLeft(x) {
        this.x = this.x - x;
    }

    moveRight(x) {
        this.x = this.x + x;
    }

    moveUp(y) {
        this.y = this.y - y;
    }

    moveDown(y) {
        this.y = this.y + y;
    }
}