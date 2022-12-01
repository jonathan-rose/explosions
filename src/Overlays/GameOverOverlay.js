import Overlay from './Overlay';
import Utils from '../Utils';

export default class GameOverOverlay extends Overlay {
    constructor(scene) {
        super(scene);

        this.model = this.scene.sys.game.globals.model;
        this.yOffset = 400;
        let style = {fontSize: '32px', fill: '#FFF'};

        this.title = this.scene.add.text(
            this.centerX,
            100,
            'Game Over',
            style
        ).setOrigin(0.5);
        this.add(this.title);

        this.scoreText = this.scene.add.text(
            this.centerX,
            200,
            '',
            style
        ).setOrigin(0.5);
        this.add(this.scoreText);

        this.highscoreText = this.scene.add.text(
            this.centerX,
            300,
            'Highscore: ' + this.model._highscore,
            style
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
        let prev = this.model._highscore;
        let curr = this.model._currentScore;
        let text = 'Score: ';

        if (this.scene.score.currentScore > this.model._highscore) {
            this.model._highscore = curr;
            text = 'New Highscore: ';
        }

        this.scoreText.setText(text + curr);
        this.highscoreText.setText('Highscore: ' + this.model._highscore);
    }
}
