import 'phaser';

export default class Exploder extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.lineStyle = 1;
        this.color = 0xffff00;
        this.alpha = 1;
             
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setGravity(0);
        this.setInteractive();

        this.graphics = new Phaser.GameObjects.Graphics(this.scene);
        this.graphics.clear();
        this.graphics.defaultFillColor = this.color;
        this.graphics.lineStyle(this.lineStyle, this.color, this.alpha);
        this.scene.add.existing(this.graphics);

        this.blastWaveDelay = Phaser.Math.Between(800, 1200); // ms
        this.blastWaveCount = Phaser.Math.Between(3, 5);
    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    startWave () {
        this.blastTimer = this.scene.time.addEvent({
            delay: this.blastWaveDelay,
            callback: function () { this.createExplosions(this.blastWaveCount) },
            callbackScope: this,
            loop: true
        });
    }

    stopWave () {
        this.blastTimer.destroy();
    }

    explode(x = this.x, y = this.y, radius = 1, duration = 0.25, delay = 2) {
        
        var startingRadius = 0;

        var warning = this.scene.add.ellipse(x, y, radius * 2, radius * 2, 0xFA8888, 0.25);

        var r = this.scene.add.circle(x, y, startingRadius, 0x6666ff); // Should the starting radius be an argument?
        
        this.scene.tweens.add({

            targets: r,
            delay: delay * 1000,
            radius: radius,
            duration: duration * 1000,
            onComplete: function () { r.destroy(), warning.destroy() },
        });
    }

    createExplosions(count = 1) { // These need to be tweaked along with the explode() function
        for (var i = 0; i <= count; i++) {
            var randX = Phaser.Math.Between(0, this.scene.cameras.main.width);
            var randY = Phaser.Math.Between(0, this.scene.cameras.main.height);
            var randRadius = Phaser.Math.FloatBetween(20, 100);
            var randDuration = Phaser.Math.FloatBetween(0.25, 1);
            this.explode(randX, randY, randRadius, randDuration);
        }
    }
}