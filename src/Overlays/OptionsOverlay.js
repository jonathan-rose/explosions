import Overlay from './Overlay';

export default class OptionsOverlay extends Overlay {
    constructor(scene) {
        super(scene);

        let {width, height} = this.scene.scale.gameSize;
        this.centerX = width / 2;

        this.yOffset = 500;

        this.title = this.scene.add.text(
            this.centerX,
            100,
            'Options',
            {fontSize: '32px',
             fill: '#FFF'}
        ).setOrigin(0.5);
        this.add(this.title);

        // @TODO: add options

        this.navData = [
            {text: 'back',
             action: 'CLOSE_OVERLAY'}
        ];

        this.initNavs();
    }
}
