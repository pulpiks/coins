import Boot from './states/Boot';
import Game from './states/Game';
import FinalScreen from './states/FinalScreen';

import { rgResizeBody } from './utils/sizes';

import {
    STATES,
} from './constants/constants';

const game: Phaser.Game;

const getSizes = () => {
    const containerNode = document.querySelector('.js-game-container') as HTMLElement;
    return rgResizeBody(containerNode);
}

function initGame(): void {
    const [ gameWidth, gameHeight ] = getSizes();
    game = new Phaser.Game({
        width: gameWidth,
        height: gameHeight,
        parent: document.querySelector('.js-game-container'),
        antialias: true,
        renderer: Phaser.CANVAS
    });

    game.state.add(STATES.Boot, Boot)
    game.state.add(STATES.Game, Game);
    game.state.add(STATES.Finish, FinalScreen);

    game.state.start(STATES.Boot);
}

window.onload = initGame;
window.onresize = () => {
    if (game) {
        console.log('////');
        game.scale.setGameSize(...getSizes());
    }
};
