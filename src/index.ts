// import * as Phaser from 'phaser-ce'

// (window as WindowPhaser).Phaser = Phaser

// import PIXI from 'phaser-ce/build/custom/pixi.js'
// import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
// import Phaser from 'expose-loader?Phaser!/node_modules/phaser-ce/build/phaser.js'
//  import Phaser from 'phaser-ce'

// interface WindowPhaser extends Window {
//     Phaser: any,
//     PIXI: any,
// }

// (window as WindowPhaser).Phaser = Phaser

import PreBoot from './states/Boot'
import Game from './states/Game'
import FinalScreen from './states/FinalScreen'

import { rgResizeBody } from './utils/sizes'

import {
    STATES,
} from './constants/constants'
import { mainMenu, Menu, MenuWrapper } from './states/Menu';
import Help from './states/Help';
// import {MenuWrapper} from './states/Menu';


const getSizes = (className: string) => {
    const containerNode = <HTMLElement>document.querySelector(className)
    return rgResizeBody(containerNode)
}

const initGame = () => {
    const className: string = '.js-game-container'
    const [ gameWidth, gameHeight ] = getSizes(className)

    this.game = new Phaser.Game({
        width: gameWidth,
        height: gameHeight,
        parent: <HTMLScriptElement>document.querySelector(className),
        antialias: true,
        renderer: Phaser.CANVAS
    })

    this.game.state.add(STATES.PreBoot, PreBoot)
    this.game.state.add(STATES.Game, Game)
    this.game.state.add(STATES.Finish, FinalScreen)
    this.game.state.add(STATES.Menu, MenuWrapper)
    this.game.state.add(STATES.Help, Help)
    this.game.state.start(STATES.PreBoot)
}

window.onload = initGame

window.onresize = () => {
    if (this.game) {
        this.game.scale.setGameSize(...getSizes('.js-game-container'))
    }
}
