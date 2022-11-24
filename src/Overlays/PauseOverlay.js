import Overlay from './Overlay';

export default class PauseOverlay extends Overlay {
    constructor(scene) {
        super(scene);

        this.title = this.scene.add.text(
            this.centerX,
            100,
            'Game Paused',
            {fontSize: '32px',
             fill: '#FFF'}
        ).setOrigin(0.5);
        this.add(this.title);

        this.navData = [
            {text: 'resume',
             action: 'CLOSE_OVERLAY'},
            {text: 'achievements',
             action: 'OPEN_OVERLAY',
             target: 'achievements'},
            {text: 'credits',
             action: 'OPEN_OVERLAY',
             target: 'credits'}
        ];

        this.initNavs();
    }
}
