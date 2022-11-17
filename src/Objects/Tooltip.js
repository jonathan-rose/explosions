import 'phaser';

export default class Tooltip extends Phaser.GameObjects.Container {
    constructor(scene, content) {
        super(scene);
        this.scene = scene;

        let padding = 2;
        this.contentText = this.scene.add.text(
            padding,
            padding,
            content,
            {fontSize: '16px',
             fill: '#FFF'}
        );
        this.width = this.contentText.width + (padding * 2);
        this.height = this.contentText.height + (padding * 2);

        this.alphaLayer = this.scene.add.rectangle(
            0,
            0,
            this.width,
            this.height,
            0x000,
        ).setOrigin(0);

        this.add(this.alphaLayer);
        this.add(this.contentText);

        this.scene.add.existing(this);
    }

    setPos(pos) {
        this.x = pos.x - (this.width / 2);
        this.y = pos.y - this.height;
    }
}
