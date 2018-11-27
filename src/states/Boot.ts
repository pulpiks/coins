import { STATES, LayersIds, passersTypes } from "../constants/constants"

import '../assets/loading.png'
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
import { utils } from "../utils";

export default class PreBoot extends Phaser.State {
    assetsPath: string = './assets/'
    preload () {
        this.load.image(LayersIds.loading, `${this.assetsPath}loading.png`)
        this.load.image(LayersIds.cactus, `${this.assetsPath}cactuses.png`)
    }

    create() {
        this.state.add(STATES.Boot, Boot);

        this.state.start(STATES.Boot)
    }
}


class Boot extends Phaser.State {
    assetsPath: string = './assets/'
    loadingBar: Phaser.Sprite
    logo: Phaser.Sprite
    status: Phaser.Text
    preloadBar: Phaser.Graphics

    init () {
        
    }

    preload () {
        this.game.stage.backgroundColor = '#000';
        this.loadingBar = this.add.sprite(this.world.centerX, 100, LayersIds.loading);
        this.logo       = this.add.sprite(this.world.centerX, 200, LayersIds.cactus);
        this.status     = this.add.text(this.world.centerX, 380, 'Loading...', {fill: 'white'});
        this.loadingBar.anchor.set(0.5, 0)
        this.logo.scale.setTo(1.2);

        utils.centerGameObjects([this.logo, this.status]);
        this.load.setPreloadSprite(this.loadingBar, 1);
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
    
    create() {
        this.status.setText('Ready!');
        this.state.start(STATES.Menu)
    }

    render () {
    }
}
