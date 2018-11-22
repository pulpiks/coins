import autobind from 'autobind-decorator'
import debounce from 'lodash.debounce'
import Phaser, { TilemapLayer } from 'phaser-ce'

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
import '../assets/obstacles.png'
import '../assets/test_level1.json'


import store from '../store'

import Enemy from './Enemy'
import Person from './Person'
import FBK from './FBK'
import Score from './Score'
import { PolicemanManager, PolicemanManagerProps } from "./Policeman"
import { CactusHandler, ThrowCactusProps, CactusHanlerProps } from "./Cactus"
import {HandsHandler} from './Hands'

import {
    backgroundColor,
    ground,
    BUIDING_COORDS,
    orderBuidings,
    typesBuiding,
    ENEMY_TYPES,
    LayersIds,
    passers,
    passersTypes
} from '../constants/constants'

import { OfficialProps, renderOfficials } from './Official'
import { renderPassers, PassersProps } from './Passer';
import { isDevelopment } from '../utils';

export default class Game extends Phaser.State{
    private map: Phaser.Tilemap
    private obstacles: Phaser.TilemapLayer
    private person: FBK
    private cactuses: Phaser.Group
    private crowd: Phaser.TilemapLayer
    private ground: Phaser.Sprite
    private cloudsSprite: Phaser.TileSprite
    private backgroundlayer: Phaser.TilemapLayer;
    private listBuidingsSprite: Phaser.Sprite[] = []
    private score: Score
    private handsHandler: HandsHandler
    private officials: OfficialProps
    private passers: PassersProps
    cactusHandler: CactusHanlerProps
    policemanWatcher: PolicemanManagerProps
    assetsPath: string = './assets/'

    init() {
         
    }

    preload() {
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
        this.loadSpritesPassers()
    }

    loadSpritesPassers = () => {
        this.load.spritesheet(`${LayersIds.passer}-${passersTypes['usual-1']}`, `${this.assetsPath}kindpasser_green.png`, 329, 894, 9)
        this.load.spritesheet(`${LayersIds.passer}-${passersTypes['usual-2']}`, `${this.assetsPath}kindpasser.png`, 329.25, 896.5, 8)
        this.load.spritesheet(`${LayersIds.passer}-${passersTypes['sentsov']}`, `${this.assetsPath}sentsov.png`, 451.5, 894, 8)
        this.load.spritesheet(`${LayersIds.passer}-${passersTypes['pupil']}`, `${this.assetsPath}pupil.png`, 445.25, 986.5, 8)
    }

    createClouds() {
        this.cloudsSprite = this.game.add.tileSprite(0, 0, this.game.width*3000, 300, 'clouds', 0)
        this.cloudsSprite.scale.set(1.1, 0.8)
        this.cloudsSprite.smoothed = true;
        this.cloudsSprite.autoScroll(-5, 0);
    }

    createGround() {
        this.ground = this.game.add.sprite(0, this.game.world.height-ground.height, 'ground')
        this.ground.width = ground.width
        this.ground.height = ground.height
        this.physics.arcade.enable(this.ground)
        this.ground.body.immovable = true
    }

    createBuidings() {
        for(let type of orderBuidings) {
            if (typeof(BUIDING_COORDS[type]) !== 'undefined') {
                let buildingInfo = BUIDING_COORDS[type]
                let building = this.game.add.sprite(
                    buildingInfo.position.x, 
                    this.game.world.height - ground.height, 
                    'buildings', 
                    `${typesBuiding[type]}`
                )
                building.anchor.setTo(buildingInfo.scale.x, buildingInfo.scale.y)
                this.listBuidingsSprite.push(building)
            }
        }
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.stage.backgroundColor = backgroundColor;
        this.game.world.setBounds(0, 0, ground.width, this.game.world.height);


        this.createClouds();
        this.createGround();
        this.createBuidings();
        
        this.map = this.add.tilemap(LayersIds.tilemap);
        
        this.map.addTilesetImage('obstacles', LayersIds.obstacles);
        this.backgroundlayer = this.map.createLayer('background', ground.width, ground.height)
        this.obstacles = this.map.createLayer('obstacles');
        this.physics.arcade.enable(this.backgroundlayer);
        const collisionPoints = [...Array(96)].map((_, v) => v)
        this.backgroundlayer.anchor.setTo(0)    
        this.physics.arcade.enable(this.obstacles);
        this.map.setCollision(collisionPoints, true, this.obstacles);
        this.map.setCollision([57, 58], true, this.backgroundlayer);
        this.backgroundlayer.resizeWorld()        
        // this.crowd = this.map.createLayer('crowd');

        // this.physics.arcade.enable(this.crowd);
        // this.map.setCollision([14], true, this.crowd);
        this.handsHandler = new HandsHandler(
            this.game
        )

        this.person = new FBK({
            game: this.game
        });
    
        // this.map.createFromObjects('cactuses', 'cactus', 'tilescactus', 0, true, false, this.cactuses);

        this.score = new Score({
            game: this.game,
        });

        this.officials = renderOfficials(this.game)
        this.passers = renderPassers(this.game)
        this.cactusHandler = CactusHandler(this.game)
        this.policemanWatcher = PolicemanManager(this.game)

        // this.tween = this.game.add.tween(this.cloudsSprite).to(
        //     {},
        //     5000,
        //     Phaser.Easing.Linear.None,
        //     true,
        //     0,
        //     -1,
        //     false
        // );

        // let cloudsSpriteAnimation = setTimeout(function tick(ctx) {
        //     ctx.cloudsSprite.tilePosition.x -= 8;
        //     clearTimeout(cloudsSpriteAnimation);
        //     setTimeout(tick, 2000);
        // }, 2000, this);
    }

    
    update() {
        this.physics.arcade.collide(
            this.person.sprite, 
            this.obstacles, 
            null, 
            null, 
            this
        );

        this.physics.arcade.collide(
            this.policemanWatcher.getAllSprites(), 
            this.obstacles, 
            this.policemanWatcher.collideWithObstacles, 
            null, 
            this
        );

        this.physics.arcade.collide(
            this.officials.sprites, 
            this.obstacles, 
            this.officials.collideWithObstacles, 
            null, 
            this
        );

        this.physics.arcade.collide(
            this.passers.sprites,
            this.obstacles,
            this.passers.collideWithObstacles,
            null,
            this
        )

        this.physics.arcade.overlap(
            this.person.sprite,
            this.policemanWatcher.getAllActivePoliceman(),
            (_: Phaser.Sprite, policeman: Phaser.Sprite) => {
                if (!isDevelopment) {
                    this.policemanWatcher.collidePerson(policeman)
                    this.person.collideWithEnemy({
                        type: ENEMY_TYPES.policeman
                    })
                }
            },
            null,
            this
        )
        this.physics.arcade.collide(
            this.ground, 
            this.policemanWatcher.getAllSprites()
        )
        this.physics.arcade.collide(
            this.person.sprite,
            this.cactusHandler.cactuses,
            (_: Phaser.Sprite, cactus: Phaser.Sprite) => {
                this.cactusHandler.collidePersonWithCactus(cactus)
            },
            null,
            this
        )
        this.physics.arcade.collide(
            this.policemanWatcher.getAllSprites(),
            this.cactusHandler.thrownCactuses, 
            (policeman: Phaser.Sprite, cactus: Phaser.Sprite) => {
                this.policemanWatcher.collideCactus(policeman)
                this.cactusHandler.collidePolicemanWithCactus(cactus)
            },
            null, 
            this
        );
        // this.physics.arcade.collide(
        //     this.obstacles, 
        //     this.thrownCactuses, 
        //     this.collideObstaclesWithCactus, 
        //     null, 
        //     this
        // );
        this.physics.arcade.collide(
            this.person.sprite, 
            this.crowd, 
            this.meetCrowd, 
            null, 
            this
        );
        this.physics.arcade.collide(
            this.person.sprite, 
            this.ground, 
            () => {
                this.person.endJumping();
            }, 
            null, 
            this.person
        );

        this.physics.arcade.collide(
            this.ground,
            this.passers.sprites
        )

        this.physics.arcade.collide(
            this.ground,
            this.officials.sprites
        )

        this.physics.arcade.overlap(
            this.person.sprite,
            this.handsHandler.getHandsSprite(),
            (_: Phaser.Sprite, handSprite: Phaser.Sprite) => {
                this.handsHandler.collidePerson(handSprite)        
            }
        )

        this.physics.arcade.overlap(
            this.person.sprite,
            this.officials.sprites,
            this.collideWithOfficials,
            null,
            this
        )

        this.physics.arcade.overlap(
            this.person.sprite,
            this.passers.sprites,
            this.collideWithPassers,
            null,
            this
        )

        this.person.update()
        this.handsHandler.update(this.person.sprite.centerX)
        this.passers.update()
        this.officials.update()
        this.cactusHandler.update()
        this.policemanWatcher.update()
    }

    collideWithOfficials(person: Phaser.Sprite, official: Phaser.Sprite) {
        this.officials.collisionWithPerson(official)
    }

    collideWithPassers(person: Phaser.Sprite, passer: Phaser.Sprite) {
        this.passers.collisionWithPerson(passer)
    }

    render() {
        this.person.render()
    }

    meetCrowd(person: Phaser.Sprite, crowd: Phaser.Sprite) {
        this.game.state.start('Finish', true, false);
    }
}
