export default class Model {
    constructor() {
        this._soundOn = true;
        this._musicOn = false;
        this._bgMusicPlaying = false;
        this._highscore = 0;
        this._achievements = {
            lookedAtExplosion1: {description: 'Look at an explosion :(',
                                 unlocked: true},
            lookedAtExplosion2: {description: 'Look at an explosion in the first 2 seconds of a game',
                                 unlocked: false},
            distanceWalked: {description: 'Walk 500 miles',
                                unlocked: false},
            highScore1: {description: 'Get a score of 10^6',
                                unlocked: true},
            highScore2: {description: 'Get a score of 10^9',
                                unlocked: false},
            highScore3: {description: 'Get a score of 10^12',
                         unlocked: false},
            highScore4: {description: 'Get a score of 10^6',
                         unlocked: false},
            highScore5: {description: 'Get a score of 10^9',
                         unlocked: true},
            highScore6: {description: 'Get a score of 10^12',
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
