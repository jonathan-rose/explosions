import Overlay from './Overlay';

export default class TitleOverlay extends Overlay {
    constructor(scene) {
        super(scene);

        this.yOffset = 450;

        this.navData = [
            {text: 'Play',
             action: 'CLOSE_OVERLAY',
             extras: ['RESET_GAME_START_TIMER']}
        ];

        this.initNavs();

        // initial black background
        this.background = this.scene.add.rectangle(
            0,
            0,
            this.width,
            this.height,
            0
        ).setOrigin(0);
        this.add(this.background);

        //      ↓     ↓
        //     COOL  GUYS
        // → DON'T LOOK← AT ←
        //     EXPLOSIONS
        //         ↑
        this.initImages();
        this.initTweens();

        // after title animation add buzzing+shuffling tweens to EXPLOSIONS
        this.addExplosionsTweens();

        // fade to reveal play nav button
        this.backgroundFade = this.scene.tweens.add({
            targets: this.background,
            alpha: 0,
            delay: 6500,
            duration: 1000
        });
    }

    // add the images for the title words to the scene and overlay
    // container. They're off screen in the direction the should come
    // from
    initImages() {
        this.titleCool = this.scene.add.image(0, -800, 'title_cool').setOrigin(0);
        this.titleGuys = this.scene.add.image(0, -800, 'title_guys').setOrigin(0);
        this.titleDont = this.scene.add.image(-800, 0, 'title_dont').setOrigin(0);
        this.titleLook= this.scene.add.image(800, 0, 'title_look').setOrigin(0);
        this.titleAt = this.scene.add.image(800, 0, 'title_at').setOrigin(0);
        this.titleExplosions1 = this.scene.add.image(0, 800, 'title_explosions1').setOrigin(0);
        this.titleExplosions2 = this.scene.add.image(0, 850, 'title_explosions2').setOrigin(0);
        this.titleExplosions3 = this.scene.add.image(0, 900, 'title_explosions3').setOrigin(0);
        this.add(this.titleCool);
        this.add(this.titleGuys);
        this.add(this.titleDont);
        this.add(this.titleLook);
        this.add(this.titleAt);
        this.add(this.titleExplosions1);
        this.add(this.titleExplosions2);
        this.add(this.titleExplosions3);
    }

    // add the tweens to animate the title word images onscreen
    initTweens() {
        this.scene.tweens.add({
            targets: this.titleCool,
            y: 0,
            delay: 769,
            duration: 200
        });
        this.scene.tweens.add({
            targets: this.titleGuys,
            y: 0,
            delay: 1450,
            duration: 200
        });
        this.scene.tweens.add({
            targets: this.titleDont,
            x: 0,
            delay: 2487,
            duration: 200
        });
        this.scene.tweens.add({
            targets: this.titleLook,
            x: 0,
            delay: 2807,
            duration: 200
        });
        this.scene.tweens.add({
            targets: this.titleAt,
            x: 0,
            delay: 3204,
            duration: 200
        });
        this.scene.tweens.add({
            targets: this.titleExplosions1,
            y: 0,
            delay: 4252,
            duration: 200
        });
        this.scene.tweens.add({
            targets: this.titleExplosions2,
            y: 0,
            delay: 4252,
            duration: 200
        });
        this.scene.tweens.add({
            targets: this.titleExplosions3,
            y: 0,
            delay: 4252,
            duration: 200
        });
    }

    addExplosionsTweens() {
        // buzzing tweens
        this.scene.tweens.add({
            targets: this.titleExplosions1,
            x: "+=5",
            yoyo: true,
            repeat: -1,
            duration: 70,
            delay: 5500
        });
        this.scene.tweens.add({
            targets: this.titleExplosions2,
            x: "-=5",
            yoyo: true,
            repeat: -1,
            duration: 70,
            delay: 5500
        });

        // shuffling tweens
        this.scene.tweens.add({
            targets: [
                this.titleExplosions1,
                this.titleExplosions2,
                this.titleExplosions3
            ],
            y: "+=6",
            yoyo: true,
            repeat: -1,
            duration: 50,
            delay: 5500
        });
    }
}
