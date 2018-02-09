import Enemy from './Enemy';
import Coins from './Coins';
import Person from './Person';

export default class Game extends Phaser.State{
    sprite: Phaser.Sprite;
    group: Phaser.Group;
    cursors: Phaser.CursorKeys;
    map: Phaser.Tilemap;
    backgroundlayer: Phaser.TilemapLayer;
    obstacles: Phaser.TilemapLayer;
    enemiesLayer: Phaser.TilemapLayer;
    enemies: Phaser.Group;
    enemiesObj: any;
    coins: Coins;
    person: Person;
    tween: Phaser.Tween;

    init() {
        this.enemiesObj = {};
    }

    preload() {
        this.load.image('person', './src/assets/phaser-dude.png');
        this.load.tilemap('tilemap', './src/assets/level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', './src/assets/super_mario.png');
        this.load.image('coin', './src/assets/one-coin.png');
        this.load.image('enemy', './src/assets/enemy.png');
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

        this.person = new Person({ game: this.game });

        this.enemies = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.map.objects.enemies.forEach((enemy) => {
            this.enemiesObj[enemy.name] = new Enemy({
                game: this.game,
                enemy,
                person: this.person,
                enemies: this.enemies
            });
            this.game.debug.body(enemy);
        });

        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update() {
        this.physics.arcade.collide(this.person.sprite, this.obstacles, this.person.collideWithEnemy, null, this);
        this.physics.arcade.collide(this.enemies, this.obstacles, null, null, this);
        this.physics.arcade.collide(this.enemies, this.person.sprite, this.person.collideWithEnemy, null, this);

        this.person.move(this.cursors);
        this.person.coins.renderMoney();
        for(let name in this.enemiesObj) {
            this.enemiesObj[name].move(this.person.sprite);
        }
    }

    collisionEnemyObstaclesHandler(enemy: Phaser.Sprite, obstacle: Phaser.Sprite) {
        if (this.enemiesObj[enemy.name].body.deltaX() != 0) {
            this.enemiesObj[enemy.name].body.velocity.y = -400;
            // ??? this.enemiesObj[enemy.name].body.velocity.x = this.enemiesObj[enemy.name]['velocityX'];
        }
    }

}