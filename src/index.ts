import Game from './states/Game';
// import FinalScreen from './states/FinalScreen';

import { rgResizeBody } from './utils/sizes';

import {
    STATES,
} from './constants/constants';


function initGame(): void {
    const containerNode = document.querySelector('.js-game-container') as HTMLElement;
    const [gameWidth, gameHeight] = rgResizeBody(containerNode);

    const game = new Phaser.Game({
        width: gameWidth,
        height: gameHeight,
        parent: containerNode,
        antialias: true,
        renderer: Phaser.CANVAS
    });

    game.state.add(STATES.Game, Game);
    // game.state.add(STATES.Finish, FinalScreen);

    game.state.start(STATES.Game);
}

initGame();