import 'phaser';
import Utils from '../Utils';

export default class Score extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.x = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
        this.y = 100;

        this.startingScore = 0;
        this.startingCombo = 1;
        this.currentScore = this.startingScore;
        this.currentCombo = this.startingCombo;

        this.addScoreTexts();

        // shuffling tween shakes score from side to side
        this.shuffling = false;
        this.shuffleTween = this.scene.tweens.add({
            targets: this.scoreTexts,
            y: "+=6",
            yoyo: true,
            repeat: -1,
            duration: 50,
            paused: true,
            delay: 0
        });

        // buzzing tween vibrates the colored background score texts
        this.buzzing = false;
        this.buzzTween0 = this.scene.tweens.add({
            targets: this.scoreTexts[0],
            x: "+=5",
            yoyo: true,
            repeat: -1,
            duration: 70,
            paused: true,
            delay: 0
        });
        this.buzzTween1 = this.scene.tweens.add({
            targets: this.scoreTexts[1],
            x: "-=5",
            yoyo: true,
            repeat: -1,
            duration: 70,
            paused: true,
            delay: 15
        });

        this.comboText = this.scene.add.text(
            765,
            570,
            "x" + this.currentCombo,
            {fontSize: '32px',
             fill: '#000'}
        ).setOrigin(1, 0.5);
    }

    addScoreTexts() {
        this.scoreTexts = [
            this.addScoreText('#000'),
            this.addScoreText('#F62DAE'),
            this.addScoreText('#FFF')
        ];
    }

    addScoreText(color) {
        return this.scene.add.text(
            this.x,
            this.y,
            this.currentScore,
            {fontSize: '64px',
             fill: color}
        ).setOrigin(0.5);
    }

    // combo altering functions
    setCombo(n) {this.currentCombo = n;}
    resetCombo() {this.currentCombo = this.startingCombo;}
    incCombo() {this.currentCombo++;}
    incComboBy(n) {this.currentCombo += n;}


    // the score text objects need to be updated to display the new score
    updateScoreTexts() {
        this.scoreTexts.forEach(s => {
            s.setText(Utils.sanitize(this.currentScore));
        });
        this.comboText.setText('x'+ this.currentCombo);
    }

    // reset score
    resetScore() {
        this.currentScore = this.startingScore;
    }

    // increment the score by the current combo value
    incScore() {
        this.currentScore += this.currentCombo;
        this.updateScoreTexts();
    }

    // increment the score by any amount
    incScoreBy(n) {
        this.currentScore += n;
        this.updateScoreTexts();
    }

    // turn the buzzing tween on
    enableBuzzing() {
        if (!this.buzzing) {
            this.buzzing = true;
            this.buzzTween0.resume();
            this.buzzTween1.resume();
        }
    }

    // turn the buzzing tween off
    disableBuzzing() {
        if (this.buzzing) {
            this.buzzing = false;
            this.buzzTween0.restart();
            this.buzzTween0.pause();
            this.buzzTween1.restart();
            this.buzzTween1.pause();
        }
    }

    // turn the shuffling tween on
    enableShuffling() {
        if (!this.shuffling) {
            this.shuffling = true;
            this.shuffleTween.resume();
        }
    }

    // turn the shuffling tween off
    disableShuffling() {
        if (this.shuffling) {
            this.shuffling = false;
            this.shuffleTween.restart();
            this.shuffleTween.pause();
        }
    }
}
