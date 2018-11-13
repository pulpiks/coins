import autobind from 'autobind-decorator'
import debounce from 'lodash.debounce'
import Phaser from 'phaser-ce'

import '../assets/player.png'
import '../assets/hands/raised_hands.png'
import '../assets/one-coin.png'
import '../assets/enemy.png'
import '../assets/ground.png'
import '../assets/cactuses.png'
import '../assets/clouds/clouds.png'
import '../assets/policeman/policeman.png'
import '../assets/passers/kindpasser.png'
import '../assets/passers/kindpasser_green.png'
import '../assets/passers/pupil.png'
import '../assets/passers/sentsov.png'


import store from '../store'

import Enemy from './Enemy'
import Person from './Person'
import FBK from './FBK'
import Score from './Score'
import Policeman from "./Policeman"
import Cactus from "./Cactus"
import {HandsHandler} from './Hands'

import {
    backgroundColor,
    ground,
    BUIDING_COORDS,
    orderBuidings,
    typesBuiding,
    POLICEMAN,
    timeOutCollide,
    CACTUS,
    ENEMY_TYPES,
    LayersIds,
    passers,
    passersTypes
} from '../constants/constants'

import {collidePersonWithPoliceman, addCactus, changeMoney} from '../actions'
import { OfficialProps, renderOfficials } from './Official'
import { renderPassers, PassersProps } from './Passer';

interface enemyObj {
    [key: string]: Enemy
}

interface CactusProp extends Phaser.Sprite {
    isKilled?: boolean
}

interface CollideEnemiesIdProps {
    [k: string]: number
}

export default class Game extends Phaser.State{
    private map: Phaser.Tilemap
    private obstacles: Phaser.TilemapLayer
    private enemies: Phaser.Group
    private enemiesObj: enemyObj = {}
    private person: FBK
    private cactuses: Phaser.Group
    private thrownCactuses: CactusProp[] = []
    private crowd: Phaser.TilemapLayer
    private ground: Phaser.Sprite
    private cloudsSprite: Phaser.TileSprite
    private collideEnemiesId: CollideEnemiesIdProps = {}
    private listBuidingsSprite: Phaser.Sprite[] = []
    private policemen: Policeman[]
    private score: Score
    private handsHandler: HandsHandler
    private officials: OfficialProps
    private passers: PassersProps
    assetsPath: string = './assets/'

    init() {
        this.policemen = [];
        
    }

    preload() {
        this.load.spritesheet(LayersIds.person, `${this.assetsPath}player.png`, 128, 128, 12)
        this.load.image(LayersIds.hands, `${this.assetsPath}raised_hands.png`)
        // need to change with of person here
        // this.load.tilemap(LayersIds.tilemap, `${assetsPath}level.json`, null, Phaser.Tilemap.TILED_JSON)
        this.load.image(LayersIds.coin, `${this.assetsPath}one-coin.png`)
        this.load.image(LayersIds.enemy, `${this.assetsPath}enemy.png`)
        this.load.image(LayersIds.ground, `${this.assetsPath}ground.png`)
        this.load.image(LayersIds.cactus, `${this.assetsPath}cactuses.png`)
        this.load.image(LayersIds.clouds, `${this.assetsPath}clouds.png`)
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
    }

    createGround() {
        this.ground = this.game.add.sprite(0, this.game.world.height-50, 'ground')
        this.ground.width = ground.width
        this.ground.height = 50
        this.physics.arcade.enable(this.ground)
        this.ground.body.immovable = true
    }

    createBuidings() {
        for(let type of orderBuidings) {
            if (typeof(BUIDING_COORDS[type]) !== 'undefined') {
                let buildingInfo = BUIDING_COORDS[type]
                let building = this.game.add.sprite(
                    buildingInfo.position.x, 
                    this.game.world.height - 50, 
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


        // this.map = this.add.tilemap('tilemap');
        // this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        this.createClouds();
        this.createGround();
        this.createBuidings();

        // this.obstacles = this.map.createLayer('obstacles');

        // this.physics.arcade.enable(this.obstacles);
        // this.map.setCollision([15, 23, 16], true, this.obstacles);

        // this.crowd = this.map.createLayer('crowd');

        // this.physics.arcade.enable(this.crowd);
        // this.map.setCollision([14], true, this.crowd);
        this.handsHandler = new HandsHandler(
            this.game
        )

        this.person = new FBK({
            game: this.game,
            onThrowCactus: this.throwCactus
        });
        
        this.enemies = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        for(let i =0; i < POLICEMAN.count; i++) {
            let policeman = new Policeman(
                this.game
            )
            this.policemen.push(policeman)
            this.enemies.add(policeman.sprite)
            this.enemiesObj[policeman.playerId] = policeman
        }

        this.cactuses = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        for(let i = 0; i < CACTUS.count; i++) {
            let cactus = new Cactus({
                game: this.game,
                x: Math.floor(Math.random() * (this.game.world.width - 100)) + 100,
                y: 120 + Math.random() * 200,
            });

            this.cactuses.add(cactus.cactus);
        }

        // this.map.createFromObjects('cactuses', 'cactus', 'tilescactus', 0, true, false, this.cactuses);

        this.score = new Score({
            game: this.game,
        });

        this.cloudsSprite.smoothed = true;
        this.cloudsSprite.autoScroll(-5, 0);

        this.officials = renderOfficials(this.game)
        this.passers = renderPassers(this.game)

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

    getPolicemen() {
        return this.policemen.map((policeman) => {
            return policeman.sprite;
        })
    }

    update() {
        // this.physics.arcade.collide(this.person.sprite, this.obstacles, null, null, this);
        // this.physics.arcade.collide(this.enemies, this.obstacles, this.collisionEnemyObstacles, null, this);
        this.physics.arcade.overlap(
            this.person.sprite,
            this.getPolicemen(),
            this.collideWithPoliceman,
            null,
            this
        )
        this.physics.arcade.collide(this.ground, this.getPolicemen());
        this.physics.arcade.collide(
            this.person.sprite,
            this.cactuses,
            this.collidePersonWithCactus,
            null,
            this
        )
        this.physics.arcade.collide(
            this.enemies,
            this.thrownCactuses, 
            this.collideEnemiesWithCactus,
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

        this.person.update();
        
        this.policemen.forEach((policeman) => {
            policeman.update();
        });

        this.removeKilledCactuses() //autocleaning killed entities
        this.removeKilledEnemies()
        this.handsHandler.update(this.person.sprite.centerX)
        this.passers.update()
        this.officials.update()
    }

    /* collide person with enemy */
    getPolicemanPlayerId(sprite: Phaser.Sprite) {
        return Object.keys(this.enemiesObj)
            .find((playedId: string) => this.enemiesObj[playedId].sprite === sprite)
    }

    collideWithPoliceman(fbk: Phaser.Sprite, policeman: Phaser.Sprite) {
        const policemanId = this.getPolicemanPlayerId(policeman)
        let cachedTime = this.collideEnemiesId[policemanId];
        if ((!cachedTime || Date.now() - cachedTime > timeOutCollide) &&
            !this.enemiesObj[policemanId].isTouchedByCactus){
            this.collideEnemiesId[policemanId] = Date.now();
            store.dispatch(collidePersonWithPoliceman({
                id: policemanId
            }));
        }
    }

    collideWithOfficials(person: Phaser.Sprite, official: Phaser.Sprite) {
        this.officials.collisionWithPerson(official)
    }

    collideWithPassers(person: Phaser.Sprite, passer: Phaser.Sprite) {
        this.passers.collisionWithPerson(passer)
    }

    render() {
        this.cactuses.forEachAlive((cactus: Phaser.Sprite) => {
            this.game.debug.body(cactus);
        }, this);

        this.person.render()
    }

    collisionEnemyObstacles(enemy: Phaser.Sprite, obstacle: Phaser.Sprite) {
        this.enemiesObj[enemy.name].collideWithObstacles(enemy, obstacle);
    }

    collidePersonWithCactus(person: Phaser.Sprite, cactus: Phaser.Sprite) {
        cactus.kill();
        this.thrownCactuses.push(cactus);
        store.dispatch(addCactus());
    }

    collideEnemiesWithCactus(cactus: CactusProp, enemy: Phaser.Sprite) {
        this.thrownCactuses.pop();
        cactus.kill();
        cactus.isKilled = true;

        const playerId = this.getPolicemanPlayerId(enemy)
        this.enemiesObj[playerId].onCactusCollision();
    }

    collideObstaclesWithCactus(obstacle: Phaser.Sprite) {
        const cactus = this.thrownCactuses.pop();
        cactus.kill();
        cactus.isKilled = true;
    }

    @autobind
    throwCactus(x:number, y:number, velocityX: number, angularVelocity: number) {
        const cactus = this.thrownCactuses[this.thrownCactuses.length-1];
        cactus.revive();
        cactus.body.x = x;
        cactus.body.y = y;
        cactus.body.velocity.x = velocityX;
        cactus.body.velocity.y = 0;
        cactus.body.angularVelocity = angularVelocity;
    }

    removeKilledCactuses() {
        this.cactuses.forEach((cactus: CactusProp) => {
            if (!cactus.alive && cactus.isKilled){
                cactus.destroy();
            }
        }, this);
    }

    removeKilledEnemies() {
        for (let name in this.enemiesObj) {
            if (this.enemiesObj[name].enemy === null) {
                this.enemiesObj[name] = null;
                delete this.enemiesObj[name];
            }
        }
    }

    meetCrowd(person: Phaser.Sprite, crowd: Phaser.Sprite) {
        this.game.state.start('Finish', true, false);
    }
}
