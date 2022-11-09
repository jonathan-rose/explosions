import 'phaser';
import Overlay from './Overlay';

export default class CreditsOverlay extends Overlay {
    constructor(scene) {
        super(scene);

        let {width, height} = this.scene.scale.gameSize;
        this.centerX = width / 2;

        this.title = this.scene.add.text(
            this.centerX,
            100,
            'Credits',
            {fontSize: '32px',
             fill: '#FFF'}
        ).setOrigin(0.5);
        this.add(this.title);

        // @TODO: add credits

        this.navData = [
            {text: 'back',
             action: 'CLOSE_OVERLAY'}
        ];

        this.initNavs();
    }
}
