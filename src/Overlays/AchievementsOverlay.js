import Overlay from './Overlay';

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
        for (const [name, aData] of Object.entries(achievements)) {
            let x = initialXOffset + ((i % 3) * xOffset);
            let y = initialYOffset + (Math.floor(i / 3) * yOffset);
            let color = 0xABABAB;
            if (aData.unlocked) { color = 0x00FFFF; }
            // @TODO: this should be an alpha layer over an image
            let achievement = this.scene.add.rectangle(
                x,
                y,
                achievementSize,
                achievementSize,
                color,
                1
            ).setOrigin(0.5);
            this.add(achievement);
            i++;
        };

        this.navData = [
            {text: 'back',
             action: 'CLOSE_OVERLAY'}
        ];

        this.initNavs();
    }
}
