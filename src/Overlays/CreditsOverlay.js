import Overlay from './Overlay';

export default class CreditsOverlay extends Overlay {
    constructor(scene) {
        super(scene);

        this.yOffset = 500;

        let styles = {fontSize: '32px', fill: '#FFF'};

        this.title = this.scene.add.text(
            this.centerX,
            100,
            'Credits',
            styles
        ).setOrigin(0.5);
        this.add(this.title);

        let credits = [
            'Programming: Jon',
            'Programming: Beth',
            'Programming: Dave',
            'Music: PJ'
        ];

        let i = 0;
        credits.forEach((c) => {
            let credit = this.scene.add.text(
                this.centerX,
                200 + (66 * i),
                c,
                styles
            ).setOrigin(0.5);
            this.add(credit);
            i++
        }, this);

        this.navData = [
            {text: 'back',
             action: 'CLOSE_OVERLAY'}
        ];

        this.initNavs();
    }
}
