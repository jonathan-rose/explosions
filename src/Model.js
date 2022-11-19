export default class Model {
    constructor() {
        this._soundOn = true;
        this._musicOn = false;
        this._bgMusicPlaying = false;
        this._highscore = 0;
        this._achievements = {
            lookedAtExplosion1: {description: 'Look at an explosion :(',
                                 unlocked: false,
                                 image: 'achievement_lookedAtExplosion1'},
            lookedAtExplosion2: {description: 'Look at an explosion in the first 2 seconds of a game',
                                 unlocked: false,
                                 image: 'achievement_lookedAtExplosion2'},
            distanceWalked: {description: 'Walk 500 miles',
                             unlocked: false,
                             image: 'achievement_500'},
            highScore1: {description: 'Get a score of 10^6',
                         unlocked: false,
                         image: 'achievement_highscore1'},
            highScore2: {description: 'Get a score of 10^9',
                         unlocked: false,
                         image: 'achievement_highscore2'},
            highScore3: {description: 'Get a score of 10^12',
                         unlocked: false,
                         image: 'achievement_highscore3'},
            maxCool: {description: 'Max out the Coolometer',
                      unlocked: false,
                      image: 'achievement_cool1'},
            stayCool: {description: 'Stay at max cool for 30 seconds',
                       unlocked: false,
                       image: 'achievement_cool2'},
            // @NOTE: this achievement is intentionally left blank to annoy people
            unknown: {description: '?????????',
                      unlocked: false}
        };
    }

    set musicOn(value) {
        this._musicOn = value;
    }

    get musicOn() {
        return this._musicOn;
    }

    set soundOn(value) {
        this._soundOn = value;
    }

    get soundOn() {
        return this._soundOn;
    }

    set bgMusicPlaying(value) {
        this._bgMusicPlaying = value;
    }

    get bgMusicPlaying() {
        return this._bgMusicPlaying;
    }

    set highscore(value) {
        this._highscore = value;
    }

    get highscore() {
        return this._highscore;
    }
}
