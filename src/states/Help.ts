import '../assets/back-arrow.png'
import '../assets/helpMoveDesktop.png'
import { STATES, LayersIds } from '../constants/constants';

class Help extends Phaser.State{
    back: Phaser.Text
    button: Phaser.Button
    assetsPath: string = './assets/'

    preload() {
        this.game.stage.backgroundColor = '#000';
        this.game.load.image('back', `${this.assetsPath}back-arrow.png`)
        this.game.load.image('helpMoveDesktop', `${this.assetsPath}helpMoveDesktop.png`)
    }

    create() {
        const backKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        backKey.onDown.add(this.handleClickBack, this);
        const data = [
            {
                image:  this.game.make.sprite(0, 0, 'helpMoveDesktop'),
                text: 'Up - jump, Left, Right - direction',
                options: {
                    image: {
                        width: 250,
                        height: 70,
                    },
                    text: {
                        boundsAlignH: "center", 
                        boundsAlignV: "middle"
                    }
                }
            }, 
            {
                image: this.game.make.sprite(0, 0, LayersIds.cactus), 
                text: 'item for the protection player against cops',
                options: {
                    image: {
                        width: 40,
                        height: 40,
                    },
                    text: {
                        boundsAlignH: "center", 
                        boundsAlignV: "middle"
                    }
                }
            }, 
            {
                image: this.game.make.sprite(0, 0, LayersIds.coin),
                text: 'Money that you need to save as much as you can',
                options: {
                    image: {
                        width: 40,
                        height: 40,
                    },
                    text: {
                        boundsAlignH: "center", 
                        boundsAlignV: "middle"
                    }
                }
            },
            {
                image: this.game.make.sprite(0, 0, LayersIds.loading),
                text: 'Stay positive otherwise the system will kill you',
                options: {
                    image: {
                        width: 70,
                        height: 30,
                    },
                    text: {
                        boundsAlignH: "center", 
                        boundsAlignV: "middle"
                    }
                }
            }
        ]


        const horizontalOffset = 100
        
        this.button = this.game.add.button(
            100, this.game.height / 15, 'back', this.handleClickBack, this, 2, 1, 0
        );

        this.back = this.game.add.text(
            140,
            this.game.height / 15,
            'Back',
            {
                fill: '#fff',
                align: 'center',
            }
        );


        const commonGroup = this.game.add.group();
        let verticalOffset = 0;
        const spacing = this.game.height / 15 < 20 ? 20 : this.game.height / 15;
        const fontSize = Math.min(22, Math.round(this.game.height / 19));
        data.forEach((item, i) => {
            let itemGroup = this.game.add.group() 
            const textObject = this.game.add.text(
                horizontalOffset,
                verticalOffset,
                `${item.text}.`,
                {
                    font: `${fontSize}px Arial`,
                    fill: '#fff',
                    wordWrap: true,
                    wordWrapWidth: this.game.width - horizontalOffset * 2,
                    ...item.options.text,
                }
            );
            itemGroup.height = 100
            this.game.add.existing(item.image)
            item.image.width = item.options.image.width
            item.image.height = item.options.image.height
            textObject.anchor.set(0, 0.5)
            textObject.y = itemGroup.centerY
            textObject.position.x = item.image.width + 50
            item.image.anchor.set(0, 0.5)
            item.image.y = itemGroup.centerY
            itemGroup.add(item.image)
            itemGroup.add(textObject);
            verticalOffset += textObject.height + spacing;
            itemGroup.y = verticalOffset
            commonGroup.add(itemGroup)
        });

        commonGroup.width = 700
        commonGroup.x = this.game.world.centerX - (commonGroup.width * 0.5);
        commonGroup.y = this.game.world.centerY - (commonGroup.height* 0.5);

        this.game.input.onDown.add(this.handleClickBack, this);
    }

    handleClickBack() {
        this.state.start(STATES.Menu, true, false);
    }
}

export default Help;