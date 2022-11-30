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
        this.warningGroup = this.scene.physics.add.group();
        this.tweenCollection = [];
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
        this.warningGroup.add(warning);

        let warningTween = this.scene.tweens.add({
            targets: warning,
            alpha: 0.35,
            step: 1,
            duration: 200,
            yoyo: true,
            repeat: -1
        });
        this.tweenCollection.push(warningTween);

        var explosion = this.scene.add.circle(x, y, startingRadius, 0xF25757); // Should the starting radius be an argument?
        this.explosionGroup.add(explosion);

        warning.setDepth(-2);
        explosion.setDepth(-1);

        var particles = this.scene.add.particles('red');
        particles.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 4 },
            speed: 100,
            lifespan: 300,
            blendMode: 'ADD',
            frequency: 10,
            maxParticles: 20,
            delay: delay*1000,
            x: x,
            y: y
        });

        var particles2 = this.scene.add.particles('yellow');
        particles2.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 4 },
            speed: 100,
            lifespan: 300,
            blendMode: 'ADD',
            frequency: 10,
            maxParticles: 20,
            delay: delay*1000,
            x: x,
            y: y
        });

        let explosionTween = this.scene.tweens.add({
            targets: explosion,
            delay: delay * 1000,
            radius: radius,
            duration: duration * 1000,
            onComplete: function () {
                explosion.destroy();
                warning.destroy();
            },
        });
        this.tweenCollection.push(explosionTween);
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

    // We need to remove all tweens for warnings and explosions first
    // (so they're not trying to update non-existent objects), then
    // remove all warnings and explosions.
    reset() {
        this.tweenCollection.forEach((t) => { t.remove(); });
        this.tweenCollection = [];
        this.explosionGroup.clear(true, true);
        this.warningGroup.clear(true, true);
        this.blastWaveCount = 1;
    }
}
