import 'phaser';

export default class Exploder extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.blastWaveDelay = Phaser.Math.Between(800, 1200); // ms
        this.blastWaveCount = 1;

        this.explosionGroup = this.scene.physics.add.group();
    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    startWave () {
        this.blastTimer = this.scene.time.addEvent({
            delay: this.blastWaveDelay,
            callback: function () { this.createExplosions(this.blastWaveCount); },
            callbackScope: this,
            loop: true
        });
    }

    stopWave () {
        this.blastTimer.destroy();
    }

    explode(x = this.x, y = this.y, radius = 1, duration = 0.25, delay = 2) {

        var startingRadius = 0;

        var warning = this.scene.add.circle(x, y, radius, 0xF2CD60, 0.45);
        this.scene.tweens.add({
            targets: warning,
            alpha: 0.35,
            step: 1,
            duration: 200,
            yoyo: true,
            repeat: -1
        });

        var explosion = this.scene.add.circle(x, y, startingRadius, 0xF25757); // Should the starting radius be an argument?

        warning.setDepth(-2);
        explosion.setDepth(-1);

        this.scene.tweens.add({
            targets: explosion,
            delay: delay * 1000,
            radius: radius,
            duration: duration * 1000,
            onComplete: function () {
                explosion.destroy();
                warning.destroy();
            },
        });

        this.explosionGroup.add(explosion);

        // var particles = this.add.particles('red');

        // var emitter = particles.createEmitter();

        // emitter.setPosition(400, 300);
        // emitter.setSpeed(200);
        // emitter.setLifespan(3000);
        // emitter.setScale(0.5);
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
