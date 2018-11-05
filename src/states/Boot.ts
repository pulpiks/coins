import { STATES } from "../constants/constants"

export default class extends Phaser.State {
    init () {
    }

    preload () {
        this.game.load.atlasJSONHash(
            'buildings', 
            './src/assets/buidings/buildings.png', 
            './src/assets/buidings/buildings.json'
        );
    }

    render () {
        this.state.start(STATES.Game)
    }
}
