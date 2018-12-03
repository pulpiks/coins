import autobind from 'autobind-decorator'
import debounce from 'lodash.debounce'
import once from 'lodash.once'
import Phaser, { TilemapLayer, Sprite } from 'phaser-ce'


import store from '../store'

import Enemy from './Enemy'
import Person from './Person'
import FBK from './FBK'
import Score from './Score'
import { PolicemanManager, PolicemanManagerProps } from "./Policeman"
import { CactusHandler, ThrowCactusProps, CactusHanlerProps } from "./Cactus"
import {HandsHandler} from './Hands'
import {render as renderObstacles} from './Obstacles'

import {
    backgroundColor,
    ground,
    BUIDING_COORDS,
    orderBuidings,
    typesBuiding,
    ENEMY_TYPES,
    LayersIds,
    passers,
    passersTypes,
    obstaclesKeys
} from '../constants/constants'

import { OfficialProps, renderOfficials } from './Official'
import { renderPassers, PassersProps, CrowdHandler } from './Passer';
import { isDevelopment } from '../utils';
import { startGame } from '../actions';

export default class Game extends Phaser.State{
    private map: Phaser.Tilemap
    private obstacles: Phaser.Group
    private person: FBK
    private cactuses: Phaser.Group
    private crowd: CrowdHandler
    private ground: Phaser.Sprite
    private cloudsSprite: Phaser.TileSprite
    private ladder: Phaser.TilemapLayer;
    private listBuidingsSprite: Phaser.Sprite[] = []
    private score: Score
    private handsHandler: HandsHandler
    private officials: OfficialProps
    private passers: PassersProps
    donation: Phaser.Group
    cactusHandler: CactusHanlerProps
    policemanWatcher: PolicemanManagerProps
    assetsPath: string = './assets/'

    init() {
        store.dispatch(startGame())
    }

    preload() {
        
    }

    createClouds() {
        this.cloudsSprite = this.game.add.tileSprite(0, 0, this.game.width * 3000, this.game.height - 200, 'clouds', 0)
        this.cloudsSprite.scale.set(1.1, 1)
        this.cloudsSprite.smoothed = true;
        this.cloudsSprite.autoScroll(-5, 0);
    }

    createGround() {
        let graphics: Phaser.Graphics = this.game.make.graphics()
        graphics.beginFill(0x766627, 1)
        graphics.drawRect(0, 0, ground.width, ground.height)
        graphics.endFill()
        graphics.boundsPadding = 0;
        this.ground = this.game.add.sprite(0, this.game.world.height - ground.height)
        this.ground.addChild(graphics)
        this.ground.width = ground.width
        this.ground.height = ground.height
        this.ground.anchor.set(0, 0)
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

    createGroundFromTiles() {
        // const layer = this.map.createLayer('background')
        // this.physics.arcade.enable(layer);
        // layer.anchor.set(0, 0)    
        // // layer.debug = true
        // this.map.setCollision([58, 59, 60], true, layer);
        // layer.position.x = 0
        // layer.position.y = 0
        // layer.fixedToCamera = false
        // layer.scrollFactorX = 0
        // layer.scrollFactorY = 0
        // layer.setScale(Math.round(this.game.world.width/this.game.width), 1)
        // layer.position.set(0, this.game.height - 512)
        // this.backgroundlayer = layer
    }


    _createObstacles() {
        // this.map.addTilesetImage('obstacles', LayersIds.obstacles);
        // const collisionPoints = [...Array(96)].map((_, v) => v)
        // this.obstacles = this.map.createLayer('obstacles');
        // this.physics.arcade.enable(this.obstacles);
        // this.obstacles.anchor.set(0, 0)
        // this.map.setCollision(collisionPoints, true, this.obstacles);
        // console.log('height = ', this.obstacles.height)
        // // this.obstacles.debug = true
        // this.obstacles.position.x = 0
        // this.obstacles.position.y = 0
        // this.obstacles.fixedToCamera = false
        // this.obstacles.scrollFactorX = 0
        // this.obstacles.scrollFactorY = 0
        // console.log(this.obstacles.getLocalBounds())
        // console.log(this.obstacles.scale.y)
        // this.obstacles.position.set(0, 0)
    }


    createObstacles() {
        
        // var bmd = this.game.make.bitmapData(320, 256)
        // bmd.copy(obstaclesKeys.texture)
        // const sprite = this.game.add.sprite(100, this.game.height - ground.height, obstaclesKeys.texture)
        // sprite.anchor.set(0, 1)
        // group.add(sprite)
        // sprite.body.immovable = true
        

        const poly = new Phaser.Polygon()

        //  And then populate it via setTo, using any combination of values as above
        poly.setTo([ new Phaser.Point(200, 100), new Phaser.Point(350, 100), new Phaser.Point(375, 200), new Phaser.Point(150, 200) ])

        // this.physics.arcade.enable(group);
        // this.physics.arcade.enable(shapeSprite);
        // group.forEach((el: Phaser.Graphics) => {
        // shapeSprite.body.allowGravity = true
        // shapeSprite.body.gravity.y = 400
        // shapeSprite.body.immovable = true
        // })

        this.obstacles = renderObstacles.call({game: this.game})
    }

    createLadder() {
        this.map = this.add.tilemap(LayersIds.tilemap);
        this.map.heightInPixels = this.game.world.height
        this.map.addTilesetImage('obstacles', LayersIds.tiles);
        this.ladder = this.map.createLayer('ladder');

        this.physics.arcade.enable(this.ladder);
        this.map.setCollision([58, 59], true, this.ladder);
        this.ladder.anchor.set(0, 0)
        // this.ladder.anchor.set(0, 1)
        this.ladder.scrollFactorY = 0
        this.ladder.scrollFactorX = 0
        this.ladder.scrollY = 0
        this.ladder.fixedToCamera = false
        // this.ladder.resize(this.game.width, this.game.world.height)
        // this.ladder.scale.set(1, Math.round(960/this.game.world.height))
    }

    createFinalPoints() {
        const coords = [{
            y: this.game.world.height - ground.height - 400,
            x: this.game.world.width - 100
        }]

        this.donation = this.game.add.physicsGroup(Phaser.Physics.ARCADE)
        // this.map.createFromObjects('finalpoints', 'point', LayersIds.donation, 0, true, false, this.donation); 

        coords.forEach((coord: Phaser.Sprite) => {
            const sprite = this.game.add.sprite(coord.x, coord.y, LayersIds.donation)
            sprite.width = 50
            sprite.height = 50
            this.donation.add(sprite)
        })
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.stage.backgroundColor = backgroundColor;
        // this.game.world.setBounds(0, 0, ground.width, this.game.world.height);
        this.game.world.resize(ground.width, this.game.height);
        this.createLadder()
        this.createClouds();
        this.createGround();
        this.createBuidings();
        this.createObstacles()
        this.createFinalPoints()
        
        

        this.handsHandler = new HandsHandler(
            this.game
        )

        this.person = new FBK({
            game: this.game
        });
        
        


        this.score = new Score({
            game: this.game,
        });

        this.officials = renderOfficials(this.game)
        this.passers = renderPassers(this.game)
        this.cactusHandler = CactusHandler(this.game)
        this.policemanWatcher = PolicemanManager(this.game)

        this.crowd = new CrowdHandler(
            this.game
        )
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
            this.policemanWatcher
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
            this.donation, 
            this.person.collideFinalPoints,
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
            this.cactusHandler.aliveCactuses(),
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
                this.cactusHandler.collideEnemyWithCactus(cactus)
            },
            null, 
            this
        );

        this.physics.arcade.collide(
            this.officials.sprites,
            this.cactusHandler.thrownCactuses, 
            (official: Phaser.Sprite, cactus: Phaser.Sprite) => {
                this.officials.collideCactus(official)
                this.cactusHandler.collideEnemyWithCactus(cactus)
            },
            null, 
            this
        );

        this.physics.arcade.collide(
            this.cactusHandler.thrownCactuses, 
            this.obstacles, 
            this.cactusHandler.collideObstaclesWithCactus,
            null, 
            this.cactusHandler
        )

        this.physics.arcade.collide(
            this.cactusHandler.thrownCactuses, 
            this.ground, 
            this.cactusHandler.collideObstaclesWithCactus, 
            null, 
            this.cactusHandler
        )

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
            this
        );

        this.physics.arcade.collide(
            this.ground,
            this.passers.sprites
        )

        this.physics.arcade.collide(
            this.ground,
            this.officials.sprites
        )

        this.physics.arcade.collide(
            this.ground,
            this.crowd.sprites
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
        this.crowd.update()
    }

    collideWithOfficials(person: Phaser.Sprite, official: Phaser.Sprite) {
        this.officials.collisionWithPerson(official)
    }

    collideWithPassers(person: Phaser.Sprite, passer: Phaser.Sprite) {
        this.passers.collisionWithPerson(passer)
    }

    render() {
        // this.game.debug.geom( this.obstacles, 'rgba(255,0,0,1)' ) ;
        // this.game.debug.body(this.ground);

        this.obstacles.forEach((o: Phaser.Sprite) => {
            // this.game.debug.body(o);
        })
        this.person.render()
        // this.game.debug.body(this.ladder);
        
    }

    meetCrowd(person: Phaser.Sprite, crowd: Phaser.Sprite) {
        this.game.state.start('Finish', true, false);
    }
}
