import {
    STATE_GAME,
} from './constants/constants';

import { rgResizeBody } from './utils/sizes';

import Game from './states/Game';

const containerNode = document.querySelector('.js-game-container') as HTMLElement;

function initGame() {
    const [gameWidth, gameHeight] = rgResizeBody(containerNode);

    const game = new Phaser.Game({
        width: gameWidth,
        height: gameHeight,
        parent: containerNode,
        antialias: true,
        renderer: Phaser.CANVAS
    });

    game.state.add(STATE_GAME, Game);

    game.state.start(STATE_GAME);
}


initGame();