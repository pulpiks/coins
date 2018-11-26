import { STATES, LayersIds, passersTypes } from "../constants/constants"

import '../assets/buildings/big_school.png'
import '../assets/buildings/innovation_house.png'
import '../assets/buildings/ministerstvo.png'
import '../assets/buildings/zakupki_and_tenderi.png'
import '../assets/buildings/buildings.png'
import '../assets/buildings/buildings.json'
import '../assets/player.png'
import '../assets/hands/raised_hands.png'
import '../assets/one-coin.png'
import '../assets/ground.png'
import '../assets/cactuses.png'
import '../assets/clouds/clouds.png'
import '../assets/policeman/policeman.png'
import '../assets/passers/kindpasser.png'
import '../assets/passers/kindpasser_green.png'
import '../assets/passers/pupil.png'
import '../assets/passers/sentsov.png'
import '../assets/super_mario.png'
import '../assets/donation.png'
import '../assets/obstacles.png'
import '../assets/test_level1.json'

export default class extends Phaser.State {
    assetsPath: string = './assets/'
    init () {
    }

    preload () {
        this.game.load.atlasJSONHash(
            'buildings', 
            './assets/buildings.png', 
            './assets/buildings.json'
        )

        this.load.spritesheet(LayersIds.person, `${this.assetsPath}player.png`, 128, 128, 12)
        this.load.image(LayersIds.hands, `${this.assetsPath}raised_hands.png`)
        this.load.tilemap(LayersIds.tilemap, `${this.assetsPath}test_level1.json`, null, Phaser.Tilemap.TILED_JSON)
        this.load.image(LayersIds.coin, `${this.assetsPath}one-coin.png`)
        this.load.image(LayersIds.tiles, `${this.assetsPath}super_mario.png`)
        this.load.image(LayersIds.ground, `${this.assetsPath}ground.png`)
        this.load.image(LayersIds.cactus, `${this.assetsPath}cactuses.png`)
        this.load.image(LayersIds.clouds, `${this.assetsPath}clouds.png`)
        this.load.image(LayersIds.obstacles, `${this.assetsPath}obstacles.png`)
        this.load.spritesheet(LayersIds.policeman, `${this.assetsPath}policeman.png`, 274, 756.5, 8)
        this.load.spritesheet(LayersIds.clerk, `${this.assetsPath}clerk.png`, 721.5, 1105, 8)
        this.load.image(LayersIds.donation, `${this.assetsPath}donation.png`);
        this.load.spritesheet(`${LayersIds.passer}-${passersTypes['usual-1']}`, `${this.assetsPath}kindpasser_green.png`, 329, 894, 9)
        this.load.spritesheet(`${LayersIds.passer}-${passersTypes['usual-2']}`, `${this.assetsPath}kindpasser.png`, 329.25, 896.5, 8)
        this.load.spritesheet(`${LayersIds.passer}-${passersTypes['sentsov']}`, `${this.assetsPath}sentsov.png`, 451.5, 894, 8)
        this.load.spritesheet(`${LayersIds.passer}-${passersTypes['pupil']}`, `${this.assetsPath}pupil.png`, 445.25, 986.5, 8)
    }

    render () {
        this.state.start(STATES.Game)
    }
}
