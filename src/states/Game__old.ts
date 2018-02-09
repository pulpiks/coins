/**
 * исходная позиция есть деньги
 * пока идет платит каждому и приносит практически ничего
 *
 *
 * деньги сначала - раздает после каждого препятствия(как выплнены препятствия, в линию на разных высотах, может пирамида)
 * грибочки нужны ли вообще? (что-то кроме денег)
 * и только после того как прошел всех чиновников - загораются бриллиантики в конце - что миссия выполнена
 */

import Coins from './counter';
import {PERSON, ENEMIES, ENEMY} from '../constants/constants';

export default class Game extends Phaser.State{
    sprite: Phaser.Sprite;
    group: Phaser.Group;
    cursors: Phaser.CursorKeys;
    map: Phaser.Tilemap;
    backgroundlayer: Phaser.TilemapLayer;
    obstacles: Phaser.TilemapLayer;
    enemiesLayer: Phaser.TilemapLayer;
    coinImage: Phaser.Sprite;
    coinSumText: Phaser.Text;
    coins: any;
    enemies: Phaser.Group;
    enemiesObj: any;
    isPersonMeetOfficer: boolean;
    isAnimated: any;
    animateMovement: any;
    init() {
        console.log('init');
        this.coins = Coins();
        this.isAnimated = null;
    }

    preload() {
        this.load.image('person', './src/assets/phaser-dude.png');
        this.load.tilemap('tilemap', './src/assets/level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', './src/assets/super_mario.png');
        this.load.image('coin', './src/assets/one-coin.png');
        this.load.image('enemy', './src/assets/enemy.png');
    }

    create() {
        // this.world.setBounds(0, 0, this.game.width * 2, this.game.height);
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.stage.backgroundColor = '#2d2d2d';

        this.map = this.add.tilemap('tilemap');
        this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        //
        this.backgroundlayer = this.map.createLayer('background');
        this.backgroundlayer.resizeWorld();
        this.obstacles = this.map.createLayer('obstacles');
        this.physics.arcade.enable(this.obstacles);
        this.map.setCollision([15, 23, 16], true, this.obstacles);
        //
        this.sprite = this.add.sprite(0, this.world.height, 'person');
        this.sprite.width = PERSON.width;
        this.sprite.height = PERSON.height;
        //
        this.sprite.anchor.set(0.5, 1);
        // // this.physics.arcade.sortDirection = Phaser.Physics.Arcade.TOP_BOTTOM;
        //
        this.physics.arcade.enable(this.sprite);
        //
        // this.sprite.body.bounce.y = 10;
        this.sprite.body.gravity.y = 2000;
        // this.sprite.body.linearDamping = 1;
        // this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
        // this.sprite.animations.play('right');
        //
        this.sprite.body.collideWorldBounds = true;

        this.camera.follow(this.sprite);
        //
        this.cursors = this.input.keyboard.createCursorKeys();

        this.coinImage = this.add.sprite(200, 100, 'coin');
        this.coinImage.width = 20;
        this.coinImage.height = 30;
        this.coinSumText = this.add
            .text(240, 100, String(this.coins.money), { font: "30px Arial", fill: "#ffffff", align: "center" });
        this.createEnemies();
    }

    createEnemies() {
        this.enemies = this.add.physicsGroup(Phaser.Physics.ARCADE);
        this.enemiesObj = {};
        this.map.objects.enemies.forEach((enemy, i) => {
            const enemySprite = this.enemies.create(
                enemy.x,
                enemy.y,
                'enemy'
            );
            enemySprite.width = ENEMY.width;
            enemySprite.height = ENEMY.height;
            enemySprite.name = 'enemy_'+i;
            this.enemiesObj[enemySprite.name] = {};
            enemySprite.anchor.set(0.5, 1);
            // enemySprite.body.gravity.y = 200;
            enemySprite.body.collideWorldBounds = true;
            enemySprite.body.immovable = true;
            this.renderMovement(enemySprite);
        });

        console.log(this.world.width, this.world.height);
    }

    renderMovement(enemy) {
        const moveEnemy = () => {
            if (this.sprite.left >= enemy.left) {
                enemy.body.velocity.x = PERSON.speed;
            }
            else {
                let dir = Math.round(Math.random());
                enemy.body.velocity.x = this.rnd.integerInRange(ENEMY.speed_min, ENEMY.speed_max) * (dir ? 1 : -1);
                this.enemiesObj[enemy.name]['velocityX'] = enemy.body.velocity.x;
            }
            enemy.body.gravity.y = 200;
            if (!!this.animateMovement) {
                clearTimeout(this.animateMovement);
                this.renderMovement(enemy);
            }
        };

        moveEnemy();
        this.animateMovement = setTimeout(moveEnemy, 2000);
    }

    update() {
        this.physics.arcade.collide(this.sprite, this.obstacles, this.collisionHandler, null, this);
        this.physics.arcade.collide(this.enemies, this.obstacles, this.collisionEnemyObstaclesHandler, null, this);
        this.physics.arcade.collide(this.enemies, this.sprite, this.meetOfficer, null, this);

        if (!this.isPersonMeetOfficer) {
            console.log('____', this.sprite.body.velocity.x);
            this.sprite.body.velocity.x = 0;

            if (this.cursors.left.isDown)
            {
                this.sprite.body.velocity.x = -200;
            }
            else if (this.cursors.right.isDown)
            {
                this.sprite.body.velocity.x = 200;
            }

            if (this.cursors.up.justDown)
            {
                if (this.sprite.body.onFloor())
                {
                    this.sprite.body.velocity.y = -600;
                }
                //     this.sprite.body.velocity.y = -200;
            }
            // this.coins.addMoney(100);
        }
        this.coinSumText.setText(this.coins.money.toString());
       // console.log(this.obstacles.debugSettings);
    }

    meetOfficer(enemy:Phaser.Sprite, player: Phaser.Sprite) {
        // встретил или нет
        const self = this;
        if (!this.isPersonMeetOfficer) {
            this.coins.grabMoney(10);
            const tween = this.game.add.tween(this.sprite).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 100, false);
            this.isPersonMeetOfficer = true;
            this.isAnimated = setTimeout(() => {
                this.isPersonMeetOfficer = false;
                this.sprite.alpha = 1;
                tween.stop();
                clearTimeout(this.isAnimated);
            }, 2000);
        }
        else {

        }
        console.log('++++++', this.sprite.body.velocity.x);
        // this.sprite.body.acceleration.x = -200;
        this.sprite.body.velocity.x = -1 * Math.abs(this.sprite.body.velocity.x);


        // this.physics.arcade.accelerateToPointer(this.sprite, {
        //     x: self.sprite.body.x,
        //     y: 0
        // }, -100, this.sprite.body.velocity.x, 0);
    }

    render() {
        this.enemies.forEach((enemy) => {
            this.game.debug.body(enemy);
        }, this);
    }

    collisionHandler (player: Phaser.Sprite, veg: Phaser.Sprite) {
    }

    collisionEnemyObstaclesHandler(enemy: Phaser.Sprite, obstacle: Phaser.Sprite) {
        if (enemy.body.deltaX() != 0) {
            enemy.body.velocity.y = -400;
            enemy.body.velocity.x = this.enemiesObj[enemy.name]['velocityX'];
        }
    }
}