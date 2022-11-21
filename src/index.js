import 'phaser';
import config from './Config/config';
import BootScene from './Scenes/BootScene';
import GameScene from './Scenes/GameScene';
import PreloaderScene from './Scenes/PreloaderScene';

import Model from './Model';

class Game extends Phaser.Game {
    constructor () {
        super(config);
        const model = new Model();
        this.globals = { model };
        this.scene.add('Boot', BootScene);
        this.scene.add('Preloader', PreloaderScene);
        this.scene.add('Game', GameScene);

        this.scene.start('Boot');
    }
}

window.game = new Game();
