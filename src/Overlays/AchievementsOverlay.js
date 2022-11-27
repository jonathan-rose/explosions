import Overlay from './Overlay';
import Tooltip from '../Objects/Tooltip';

export default class AchievementsOverlay extends Overlay {
    constructor(scene) {
        super(scene);

        this.yOffset = 500;

        this.title = this.scene.add.text(
            this.centerX,
            100,
            'Achievements',
            {fontSize: '32px',
             fill: '#FFF'}
        ).setOrigin(0.5);
        this.add(this.title);

        this.model = this.scene.sys.game.globals.model;
        let achievements = this.model._achievements;

        let xOffset = 120;
        let yOffset = 120;
        let initialXOffset = this.centerX - xOffset;
        let initialYOffset = 180;
        let achievementSize = 100;
        let i = 0;
        this.achievements = [];
        for (const [name, aData] of Object.entries(achievements)) {
            let x = initialXOffset + ((i % 3) * xOffset);
            let y = initialYOffset + (Math.floor(i / 3) * yOffset);

            let image = this.scene.add.image(x, y, aData.image);

            let color = 0x555555;
            if (aData.unlocked) {
                color = 0x00FFFF;
            }
            let alphaLayer = this.scene.add.rectangle(
                x,
                y,
                achievementSize,
                achievementSize,
                color,
                0.7
            ).setOrigin(0.5);

            // if the achievement is unlocked draw the image on top of the rectangle
            if (aData.unlocked) {
                this.add(alphaLayer);
                this.add(image);
            } else {
                this.add(image);
                this.add(alphaLayer);
            }

            this.achievements.push({
                name: name,
                alphaLayer: alphaLayer,
                image: image,
                description: aData.description
            });

            i++;
        };

        // tooltips have to be added after to stay on top of alphaLayers
        // (setDepth() doesn't work inside containers)
        this.tooltips = [];
        this.achievements.forEach((a) => {
            let t = new Tooltip(this.scene, a.description);
            t.visible = false;
            this.add(t);
            this.tooltips.push(t);
            a.alphaLayer.setInteractive();
            a.alphaLayer.on('pointerover', () => { t.visible = true; });
            a.alphaLayer.on('pointerout', () => { t.visible = false; });
            a.alphaLayer.on('pointermove', (p) => { t.setPos(p.position); });

        }, this);

        this.navData = [
            {text: 'back',
             action: 'CLOSE_OVERLAY'}
        ];

        this.initNavs();
    }

    updateAchievements() {
        let achievements = this.model._achievements;
        this.achievements.forEach(({name, alphaLayer, image}) => {
            if (achievements[name].unlocked) {
                this.bringToTop(image);
                alphaLayer.fillColor = 0x00FFFF;
            }
        }, this);

        this.tooltips.forEach((t) => {
            this.bringToTop(t);
        }, this);
    }
}
