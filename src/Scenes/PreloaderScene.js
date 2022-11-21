import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor () {
        super('Preloader');
    }

    preload () {
        var logo = this.add.image(400, 120, 'Logo');
        logo.setScale(0.45);

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        // update progress bar
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        // update file progress text
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        // load assets needed in our game
        this.load.image('button', 'assets/img/button.png');
        this.load.image('buttonPressed', 'assets/img/buttonPressed.png');
        this.load.image('box', 'assets/img/boxUnchecked.png');
        this.load.image('checkedBox', 'assets/img/boxChecked.png');
        this.load.image('logo', 'assets/img/logo.png');
        this.load.image('sky', 'assets/img/sky.png');
        this.load.image('green', 'assets/particles/green.png');
        this.load.image('player', 'assets/img/player.png');
        this.load.image('coolometer', 'assets/img/coolometerBackground.png');

        this.load.image('achievement_lookedAtExplosion1', 'assets/img/achievement_eye-1.png');
        this.load.image('achievement_lookedAtExplosion2', 'assets/img/achievement_eye-2.png');
        this.load.image('achievement_500', 'assets/img/achievement_500.png');
        this.load.image('achievement_highscore1', 'assets/img/achievement_10-6.png');
        this.load.image('achievement_highscore2', 'assets/img/achievement_10-9.png');
        this.load.image('achievement_highscore3', 'assets/img/achievement_10-12.png');
        this.load.image('achievement_cool1', 'assets/img/achievement_cool-1.png');
        this.load.image('achievement_cool2', 'assets/img/achievement_cool-2.png');

        this.load.audio('music', ['assets/audio/dont_look_back.mp3']);
        this.load.audio('musicMuffled', ['assets/audio/dont_look_back-muffled.mp3']);

        // ....


        // remove progress bar when complete
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            this.ready();
        }.bind(this));
    }

    ready () {
        this.scene.start('Game');
    }
};
