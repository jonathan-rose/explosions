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

        // @TODO: add achievements

        this.navData = [
            {text: 'back',
             action: 'CLOSE_OVERLAY'}
        ];

        this.initNavs();
    }
}
