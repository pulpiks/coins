import store, { State } from "../store";
import { COINS, LayersIds, STATES } from "../constants/constants";
import { isDevelopment } from "../utils";

import '../assets/smiles.png'
import '../assets/menu_bg.png'
import { startGame } from "../actions";

class FinalScreen {
    game: Phaser.Game;
    back: Phaser.Text;
    state: State
    assetsPath: string = './assets/'
    heading: Phaser.Text
    backWrapper: Phaser.Graphics
    bg: Phaser.TileSprite
    enterKey: Phaser.Key

    preload() {
        this.game.stage.backgroundColor = 'rgb(65, 75, 122)'
        this.game.load.spritesheet(LayersIds.mood, `${this.assetsPath}smiles.png`, 203.2, 204, 5)
        this.game.load.image(LayersIds.coin, `${this.assetsPath}one-coin.png`)
        this.game.load.image('background',`${this.assetsPath}menu_bg.png`);
    }

    createCharacteristics() {
        const money = this.state.score.money
        const mood = this.state.mood.total
        let moodTemplate = ''
        let moodLevel;
        if (mood < 40) {
            moodTemplate = `But, you mood is rather poor at this momemt. \nJust follow the next tips to boost your mind - try to meet more passers and touch them, they will inspire you. \nTry to avoid all communications with policemen because they make you feel sad in this case \nthrowing a cactus looks a good idea. Good luck!`
            moodLevel = 'bad'
        }
        else if (mood < 80) {
            moodTemplate = `Cheer up when something goes wrong :) \nEvery day may not be good, but there’s something good in every day. \nYou will feel better when you escape meetings with policeman and officials.`
            moodLevel = 'good'
        }
        else {
            moodTemplate = `You're a professional! Seems that you can overcome even more difficult missions.`
            moodLevel = 'excellent'
        }

        let moneyTalk = ''
        if (money < COINS.startSum) {
            moneyTalk = `Good job! \nYou earned ${money}, but that's not so much to invest this money to some business or any good deals. \nThe thing is all clashes with police lead to irritation and mood reduction. \nSo, please, try to avoid routine communication with officials and any kinds of clerks.`
        }
        else {
            moneyTalk = `How did you do that! Unbelievable! You saved ${money} RUR from Government waste. \nAnd that means you can invest it to the profitable business as an investment or in any good deals like building new schools ans kindegartens.`
        }
        return {
            moodTemplate,
            moneyTalk,
            moodLevel
        }    
    }

    create() {
        this.game.world.setBounds(0, 0, this.game.width, this.game.height);
        this.bg = this.game.add.tileSprite(0, 0, this.game.world.width * 5, this.game.world.height * 5, 'background');
        this.bg.scale.set(0.3, 0.3)
        this.bg.smoothed = true;
        this.bg.alpha = 0.2
        this.state = store.getState()
        const statusGame = this.state.statusGame.status
        const statusGameStatusMsg = this.state.statusGame.msg

        let title = ''
        let description = ''
        switch(statusGame) {
            case "fail":
                title = 'Game Over, Man!'
                description = `${statusGameStatusMsg} \n You should try again, the most important thing is not to give up and \ndefeat the damned corrupt! Good luck!`
                break;
            case "end":
                title = 'Congratulations!'
                description = 'That was hard but you did it!'
                break;
            default: 
                return ;        
        }
        const bar = this.game.add.graphics()
        bar.beginFill(0x000000, 0.2)
        bar.drawRect(0, 100, this.game.width, 100)


        this.heading = this.game.add.text(
            0,
            0,
            title, 
            {
                fill: '#fff',
                align: 'center',
                wordWrapWidth: this.game.width * 0.7,
                boundsAlignH: "center",
                boundsAlignV: "middle", 
            },
        )

        // heading.anchor.set(0.5);

        this.heading.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            
        this.heading.setTextBounds(0, 100, this.game.width, 100);    

        const descriptionElement = this.game.add.text(
            this.game.world.centerX ,
            bar.getBounds().y + bar.getBounds().height + 10,
            description, 
            {
                font: 'bold 25px Arial',
                fill: '#fff',
                align: 'center',
                wordWrapWidth: this.game.width * 0.7 ,
            },
        )

        descriptionElement.lineSpacing = 5
        descriptionElement.strokeThickness = 5;
        descriptionElement.setShadow(2, 2, "#333333", 2, true, false);

        descriptionElement.anchor.set(0.5, 0);
         
        const {y, height} = descriptionElement.getBounds()   
        let offset = y + height
        
        if (statusGame !== 'fail') {
            const characteristics = this.createCharacteristics()
    
            interface CharacteristicsMapping {
                readonly [key: string]: string
            }
            const characteristicsMapping: CharacteristicsMapping = {
                [LayersIds.mood]: characteristics.moodTemplate,
                [LayersIds.coin]: characteristics.moneyTalk
            }
            
            for(let key in characteristicsMapping) {
                let results: Phaser.Group = this.game.add.group();
                let icon: Phaser.Sprite;
                if (key === LayersIds.mood) {
                    icon = this.game.add.sprite(50, 50, LayersIds.mood);
                    switch(characteristics.moodLevel) {
                        case "bad":
                            icon.frame = 4
                        case "good":
                            icon.frame = 0
                        case "excellent":
                            icon.frame = 2
                        default:
                            icon.frame = 0    
                    }
                    icon.width = 50
                    icon.height = 50
                }
    
                if (key === LayersIds.coin) {
                    icon = this.game.add.sprite(50, 50, LayersIds.coin);
                    icon.width = 50
                    icon.height = 50
                }
    
                // icon.anchor.set(0, 0.5);
                const textObject = this.game.add.text(
                    0,
                    0,
                    `${characteristicsMapping[key]}`,
                    {
                        font: `20px Arial`,
                        fill: '#fff',
                        wordWrap: true,
                        wordWrapWidth: this.game.width * 0.6,
                        align: 'left',
                    }
                );
    
                textObject.x = 110
    
                icon.centerY = textObject.centerY
    
                results.add(icon)
                results.add(textObject)
                offset += 40
                results.y = offset;
                offset +=  textObject.height
                results.centerX = this.game.world.centerX
            }
        }

        offset += 50

        const validationButtonText = this.game.add.text(
            0, 
            0,
            'Press Enter or click on button below', 
            {
                font: '19px Arial',
                fill: '#fff',
                align: 'center',
                wordWrapWidth: this.game.width * 0.7 ,
            },
        )

        validationButtonText.centerX = this.game.world.centerX
        validationButtonText.y = offset

        this.backWrapper = this.game.add.graphics()
        this.backWrapper.beginFill(0xd70000, 0.9)
        this.backWrapper.drawRect(this.game.world.centerX - 300/2, offset + 50, 300, 100);
        

        this.back = this.game.add
        .text(
            0,
            0,
            `Start again!`,
            {
                font: `28px Arial`,
                fill: '#fff',
                align: 'center',
                fontWeight: 'bold',
                boundsAlignH: "center",
                boundsAlignV: "middle", 
                wordWrap: true, 
                wordWrapWidth: 200 
            }
        );
        this.back.setTextBounds(this.game.world.centerX -  300/2, offset + 50, 300, 100)

        // this.back.anchor.set(0.5)
        
        // this.back.anchor.setTo(0.5, 0.5);
        // backWrapper.addChild(this.back);
        // this.game.world.addChild(backWrapper);
        // let backWrapper = this.game.add.graphics();
        // backWrapper.beginFill(0x000000, 0.2);
        // backWrapper.drawRect(this.game.world.centerX - this.back.centerX, this.game.world.height - 200, 200, 100);
        // this.back.setTextBounds(100, 100, this.back.texture.frame.width, this.back.texture.frame.height)    
        this.back.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        const grd = this.back.context.createLinearGradient(0, 0, this.back.width, this.back.height);

        grd.addColorStop(0, '#FFD1AA');   
        grd.addColorStop(1, '#D49A6A');

        this.back.fill = grd
        
        this.game.input.onDown.add(this.handleClickBack, this);

        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    }

    render() {
        
    }

    handleClickBack() {
        if (this.backWrapper.getBounds().contains(this.game.input.x, this.game.input.y)) {
            this.game.input.onDown.remove(this.handleClickBack, this);
            this.game.state.start(STATES.PreBoot, true, false);
            return true;
        }
    }

    update() {
        if (this.enterKey.isDown) {
            this.game.state.start(STATES.PreBoot, true, false);
        }
    }
}

export default FinalScreen;