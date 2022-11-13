import Overlay from './Overlay';

export default class PauseOverlay extends Overlay {
    constructor(scene) {
        super(scene);
        this.name = 'pause';

        let {width, height} = scene.sys.game.scale.gameSize;
        this.centerX = width / 2;

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
            {text: 'options',
             action: 'OPEN_OVERLAY',
             target: 'options'},
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
