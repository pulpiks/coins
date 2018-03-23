import autobind from 'autobind-decorator';

import Enemy from './Enemy';
import Coins from './Coins';
import Person from './FBK_person';
import Score from './Score';
import Mood from './Mood';


import {backgroundColor, ground, BUIDING_COORDS, orderBuidings, typesBuiding} from '../constants/constants';
import Policeman from "./Policeman";

interface enemyObj {
    [key: string]: Enemy
}

interface CactusProp extends Phaser.Sprite {
    isKilled?: boolean
}

export default class Game extends Phaser.State{
    private group: Phaser.Group;
    private cursors: Phaser.CursorKeys;
    private map: Phaser.Tilemap;
    private backgroundlayer: Phaser.TilemapLayer;
    private obstacles: Phaser.TilemapLayer;
    private enemies: Phaser.Group;
    private enemiesObj: enemyObj = {};
    private coins: Coins;
    private person: Person;
    private cactuses: Phaser.Group;
    private thrownCactuses: CactusProp[] = [];
    private score: Score;
    private crowd: Phaser.TilemapLayer;
    private ground: Phaser.Sprite;
    private mood: Mood;

    init() {
    }

    preload() {
        this.load.spritesheet('person', './src/assets/player.png', 128, 128, 12);
        this.load.tilemap('tilemap', './src/assets/level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', './src/assets/super_mario.png');
        this.load.image('coin', './src/assets/one-coin.png');
        this.load.image('enemy', './src/assets/enemy.png');
        this.load.image('ground', './src/assets/ground.png');
        this.load.spritesheet('tilescactus', './src/assets/cactuses.png', 48, 64);
        this.load.image('clouds', './src/assets/clouds/clouds.png');
        this.load.spritesheet('policeman', './src/assets/policeman/policeman.png', 274, 756.5, 1);


    }

    createClouds() {
        this.cloudsSprite = this.game.add.tileSprite(0, 0, this.game.width*3000, 300, 'clouds', 0);

        // this.cloudsSprite.animations.play('clouds', 10, true);
        // this.cloudsAnimation = this.cloudsSprite.animations.add('cloudsmove', [1,2], 1, true);
        // this.animationsStand = this.cloudsAnimation.animations.add('move', [2, 3], 1, true);

    }

    createGround() {
        // var ground = this.game.platforms.create(0, 200, 'ground');
        // platforms = this.game.add.physicsGroup();
        // const platforms = this.game.add.group();
        // platforms.enableBody = true;
        console.log(this.game.world.height);
        this.ground = this.game.add.sprite(0, this.game.world.height-50, 'ground');
        this.ground.width = ground.width;
        this.ground.height = 50;
        this.physics.arcade.enable(this.ground);
        this.ground.body.immovable = true;
    }

    createBuidings() {
        this.listBuidingsSprite = [];
        for(let type of orderBuidings) {
            if (typeof(BUIDING_COORDS[type])!== 'undefined') {
                let buildingInfo = BUIDING_COORDS[type];
                let building = this.game.add.sprite(
                    buildingInfo.position.x, this.game.world.height - 50, 'buildings', typesBuiding[type]
                );
                building.anchor.setTo(buildingInfo.scale.x, buildingInfo.scale.y);
                this.listBuidingsSprite.push(building);
            }
        }
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.stage.backgroundColor = backgroundColor;
        this.game.world.setBounds(0, 0, ground.width, this.game.world.height);

        // const folder = this.game.add.sprite(camW * 0.27, camH * 1.03, 'buildings');

        this.map = this.add.tilemap('tilemap');
        this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        this.createClouds();
        this.createGround();
        this.createBuidings();
        this.mood = new Mood({
            game: this.game
        });

        // this.backgroundlayer = this.map.createLayer('background');
        // this.backgroundlayer.resizeWorld();

        this.obstacles = this.map.createLayer('obstacles');

        this.physics.arcade.enable(this.obstacles);
        this.map.setCollision([15, 23, 16], true, this.obstacles);

        this.crowd = this.map.createLayer('crowd');

        this.physics.arcade.enable(this.crowd);
        this.map.setCollision([14], true, this.crowd);

        this.coins = new Coins({
            game: this.game
        });

        this.person = new Person({
            game: this.game,
            coins: this.coins,
            onThrowCactus: this.throwCactus
        });

        this.policeman = new Policeman(
            this.game
        );


        this.enemies = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        this.map.objects.enemies.forEach((enemy: Phaser.Sprite) => {
            if (enemy.visible) {
                let enemyObj = new Enemy({
                    game: this.game,
                    enemy,
                    person: this.person,
                    enemies: this.enemies
                });

                this.enemiesObj[enemyObj.enemySprite.name] = enemyObj;

                this.game.debug.body(enemy);
            }
        });

        this.cactuses = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        this.map.createFromObjects('cactuses', 'cactus', 'tilescactus', 0, true, false, this.cactuses);

        this.cactuses.forEach((cactus: Phaser.Sprite) => {
            cactus.body.allowGravity = false;
            cactus.width = 20;
            cactus.height = 20;
        }, this);

        this.score = new Score({
            game: this.game,
            person: this.person,
            coins: this.coins
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cloudsSprite.smoothed = true;
        this.cloudsSprite.autoScroll(-5, 0);

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
        this.physics.arcade.collide(this.person.sprite, this.obstacles, null, null, this);
        this.physics.arcade.collide(this.enemies, this.obstacles, this.collisionEnemyObstacles, null, this);
        this.physics.arcade.collide(this.enemies, this.person.sprite, this.person.collideWithEnemy.bind(this.person, this.enemiesObj), null, this);
        this.physics.arcade.collide(this.person.sprite, this.cactuses, this.collidePersonWithCactus, null, this);
        this.physics.arcade.collide(this.enemies, this.thrownCactuses, this.collideEnemyWithCactus, null, this);
        this.physics.arcade.collide(this.obstacles, this.thrownCactuses, this.collideObstaclesWithCactus, null, this);
        this.physics.arcade.collide(this.person.sprite, this.crowd, this.meetCrowd, null, this);
        this.physics.arcade.collide(this.person.sprite, this.ground, this.person.endJumping, null, this.person);

        this.person.update();
        this.score.update();
        for (let name in this.enemiesObj) {
            this.enemiesObj[name].move(this.person.sprite);
        }
        this.removeKilledCactuses(); //autocleaning killed entities
        this.removeKilledEnemies();

        // this.cloudsSprite.animations.play('cloudsmove');

    }


    render() {
        this.cactuses.forEachAlive((cactus: Phaser.Sprite) => {
            this.game.debug.body(cactus);
        }, this);

        this.game.debug.geom(this.person.sprite.getBounds());

    }

    collisionEnemyObstacles(enemy: Phaser.Sprite, obstacle: Phaser.Sprite) {
        this.enemiesObj[enemy.name].collideWithObstacles(enemy, obstacle);
    }

    collidePersonWithCactus(person: Phaser.Sprite, cactus: Phaser.Sprite) {
        this.person.addCactus(cactus);
        // this.thrownCactuses.pop();
    }

    collideEnemyWithCactus(cactus: CactusProp, enemy: Phaser.Sprite) {
        this.thrownCactuses.pop();
        cactus.kill();
        cactus.isKilled = true;
        // todo enemy harm

        this.enemiesObj[enemy.name].onCactusCollision();
    }

    collideObstaclesWithCactus(obstacle: Phaser.Sprite) {
        const cactus = this.thrownCactuses.pop();
        cactus.kill();
        cactus.isKilled = true;
    }

    @autobind
    throwCactus(cactus: Phaser.Sprite, x:number, y:number, velocityX: number, angularVelocity: number) {
        this.thrownCactuses.push(cactus);
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
