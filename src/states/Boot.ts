import { STATES } from "../constants/constants"

import '../assets/buildings/big_school.png'
import '../assets/buildings/innovation_house.png'
import '../assets/buildings/ministerstvo.png'
import '../assets/buildings/zakupki_and_tenderi.png'
import '../assets/buildings/buildings.png'
import '../assets/buildings/buildings.json'

export default class extends Phaser.State {
    init () {
    }

    preload () {
        this.game.load.atlasJSONHash(
            'buildings', 
            './assets/buildings.png', 
            './assets/buildings.json'
        )
    }

    render () {
        this.state.start(STATES.Game)
    }
}
