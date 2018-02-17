// import autobind from 'autobind-decorator';

import Enemy from './Enemy';
import Coins from './Coins';
import Person from './Person';
import Score from './Score';

interface enemyObj {
    [key: string]: Enemy
}

export default class Game extends Phaser.State{
    private group: Phaser.Group;
    private cursors: Phaser.CursorKeys;
    private map: Phaser.Tilemap;
    private backgroundlayer: Phaser.TilemapLayer;
    private obstacles: Phaser.TilemapLayer;
    private enemies: Phaser.Group;
    // private enemiesObj: { string: Enemy } = {};
    private enemiesObj: enemyObj;
    private coins: Coins;
    private person: Person;
    private cactuses: Phaser.Group;
    private thrownCactuses: Phaser.Sprite[] = [];
    private score: Score;
    private crowd: Phaser.TilemapLayer;

    init() {
    }

    preload() {
        this.load.spritesheet('person', './src/assets/player.png', 32, 32, 2);
        this.load.tilemap('tilemap', './src/assets/level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', './src/assets/super_mario.png');
        this.load.image('coin', './src/assets/one-coin.png');
        this.load.image('enemy', './src/assets/enemy.png');
        this.load.spritesheet('tilescactus', './src/assets/cactuses.png', 48, 64);
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.stage.backgroundColor = '#2d2d2d';

        this.map = this.add.tilemap('tilemap');
        this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

        this.backgroundlayer = this.map.createLayer('background');
        this.backgroundlayer.resizeWorld();

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
            onThrowCactus: this.throwCactus.bind(this)
        });

        this.enemies = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        this.map.objects.enemies.forEach((enemy) => {
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

        this.cactuses.forEach((cactus) => {
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
    }

    update() {
        this.physics.arcade.collide(this.person.sprite, this.obstacles, null, null, this);
        this.physics.arcade.collide(this.enemies, this.obstacles, this.collisionEnemyObstacles, null, this);
        this.physics.arcade.collide(this.enemies, this.person.sprite, this.person.collideWithEnemy.bind(this.person, this.enemiesObj), null, this);
        this.physics.arcade.collide(this.person.sprite, this.cactuses, this.collidePersonWithCactus, null, this);
        this.physics.arcade.collide(this.enemies, this.thrownCactuses, this.collideEnemyWithCactus, null, this);
        this.physics.arcade.collide(this.obstacles, this.thrownCactuses, this.collideObstaclesWithCactus, null, this);
        this.physics.arcade.collide(this.person.sprite, this.crowd, this.meetCrowd, null, this);

        this.person.update();
        this.score.update();
        for (let name in this.enemiesObj) {
            this.enemiesObj[name].move(this.person.sprite);
        }
        this.removeKilledCactuses(); //autocleaning killed entities
        this.removeKilledEnemies();
    }

    render() {
        this.cactuses.forEachAlive((cactus) => {
            this.game.debug.body(cactus);
        }, this);

        this.game.debug.geom(this.person.sprite.getBounds());
    }

    collisionEnemyObstacles(enemy: Phaser.Sprite, obstacle: Phaser.Sprite) {
        this.enemiesObj[enemy.name].collideWithObstacles();
    }

    collidePersonWithCactus(persionSprite: Phaser.Sprite, cactus: Phaser.Sprite) {
        this.person.addCactus(cactus);
        // this.thrownCactuses.pop();
    }

    collideEnemyWithCactus(cactus: Phaser.Sprite, enemy: Phaser.Sprite) {
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

    // @autobind
    throwCactus(cactus, x, y, velocityX, angularVelocity) {
        this.thrownCactuses.push(cactus);
        cactus.body.x = x;
        cactus.body.y = y;
        cactus.body.velocity.x = velocityX;
        cactus.body.velocity.y = 0;
        cactus.body.angularVelocity = angularVelocity;
    }

    removeKilledCactuses() {
        this.cactuses.forEach((cactus) => {
            if (cactus.isKilled){
                cactus.destroy();
            }
        });
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
