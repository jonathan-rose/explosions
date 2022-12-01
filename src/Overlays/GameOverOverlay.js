import Overlay from './Overlay';
import Utils from '../Utils';

export default class GameOverOverlay extends Overlay {
    constructor(scene) {
        super(scene);

        this.yOffset = 400;

        this.title = this.scene.add.text(
            this.centerX,
            100,
            'Game Over',
            {fontSize: '32px',
             fill: '#FFF'}
        ).setOrigin(0.5);
        this.add(this.title);

        this.highscoreText = this.scene.add.text(
            this.centerX,
            200,
            '',
            {fontSize: '32px',
             fill: '#FFF'}
        ).setOrigin(0.5);
        this.add(this.highscoreText);

        this.navData = [
            {text: 'play again',
             action: 'RESTART_GAME'},
             {text: 'achievements',
             action: 'OPEN_OVERLAY',
             target: 'achievements'
             }
        ];

        this.initNavs();
    }

    updateScore() {
        this.model = this.scene.sys.game.globals.model;

        let prev = this.model._highscore;
        let curr = this.model._currentScore;
        let text = 'Score: ';

        if (this.scene.score.currentScore > this.model._highscore) {
            this.model._highscore = curr;
            text = 'New Highscore: ';
        }

        this.highscoreText.setText(text + curr);
    }
}
