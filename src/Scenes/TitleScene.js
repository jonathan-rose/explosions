import 'phaser';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
    constructor () {
	super('Title');
    }

    preload () {

    }

    create () {
        var config = this.game.config;
        this.add.image(config.width*0.3, config.height/2, 'Logo');
    }
};
