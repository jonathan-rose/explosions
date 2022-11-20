import Overlay from './Overlay';

export default class GameOverOverlay extends Overlay {
    constructor(scene) {
        super(scene);

        this.yOffset = 500;

        this.title = this.scene.add.text(
            this.centerX,
            100,
            'Game Over',
            {fontSize: '32px',
             fill: '#FFF'}
        ).setOrigin(0.5);
        this.add(this.title);

        // @TODO: add score/highscore

        this.navData = [
            {text: 'play again',
             action: 'RESTART_GAME'}
        ];

        this.initNavs();
    }
}
