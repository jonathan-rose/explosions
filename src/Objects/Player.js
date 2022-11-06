import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.setCollideWorldBounds = true;
      
        //setInteractive can have a hitarea specified as an argument.
        //update this with the geometry of the sprite.
        //Body won't rotate with arcade physics. Move to matter?
        this.setInteractive();
        
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setGravity(0);

    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    moveLeft(x) {
        // this.x -= x;
        this.setAngle(-90);
        this.setVelocity(-x, 0);
    }

    moveRight(x) {
        // this.x += x;
        this.setAngle(90);
        this.setVelocity(x, 0);
    }

    moveUp(y) {
        // this.y -= y;
        this.setAngle(0);
        this.setVelocity(0, -y);
    }

    moveDown(y) {
        // this.y += y;
        this.setAngle(180);
        this.setVelocity(0, y);
    }

    moveUpLeft(x) {
        this.x += x;
    }
}