import 'phaser';

export default class Exploder extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
             
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setGravity(0);
        this.setInteractive();
    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    explode(strength) {
        this.blast = new Phaser.Geom.Circle(this.x, this.y, strength);
    }
}