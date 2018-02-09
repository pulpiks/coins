let sprite: Phaser.Sprite;
let group: Phaser.Group;
let cursors: Phaser.CursorKeys;

export default class Game extends Phaser.State{
    init() {
        console.log('init');
    }

    preload() {
        this.load.image('person', './src/assets/phaser-dude.png');
        // this.load.image('veggies', './src/assets/fruitnveg64wh37.png');
        // this.load.image('ground', './src/assets/platform.png');
        this.game.load.tilemap('tilemap', './src/assets/level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', './src/assets/super_mario.png');
    }


    createGround() {
        let platforms = this.game.add.group();

        this.game.load.image('tiles', 'assets/tilesheet128.png');


        let ground = platforms.create(0, this.game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;
        ground.body.gravityScale = 0;
        let ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge.body.gravityScale = 0;

        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;
        ledge.body.gravityScale = 0;
    }

    create() {
        this.world.setBounds(0, 0, this.game.width * 2, this.game.height);
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.stage.backgroundColor = '#2d2d2d';

        this.createGround();
        sprite = this.add.sprite(0, this.game.height, 'phaser');

        sprite.anchor.set(0.5, 1);
        // this.physics.arcade.sortDirection = Phaser.Physics.Arcade.TOP_BOTTOM;
        this.physics.arcade.sortDirection = Phaser.Physics.Arcade.BOTTOM_TOP;

        this.physics.arcade.enable(sprite);

        group = this.add.physicsGroup(Phaser.Physics.ARCADE);

        for (var i = 0; i < 1; i++)
        {
            var c = group.create(this.rnd.integerInRange(64, this.world.width-64), this.rnd.integerInRange(100, this.world.height), 'veggies', this.rnd.integerInRange(0, 36));
            c.name = 'veg' + i;
            c.body.immovable = true;
        }

        // for (var i = 0; i < 20; i++)
        // {
        //     //  Here we'll create some chillis which the player can pick-up. They are still part of the same Group.
        //     var c = group.create(this.rnd.integerInRange(64, this.world.width-64), this.rnd.integerInRange(100, this.world.height), 'veggies',17);
        //     c.body.immovable = true;
        // }

        this.camera.follow(sprite);

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

        this.physics.arcade.collide(sprite, group, this.collisionHandler, null, this);

        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;

        if (cursors.left.isDown)
        {
            sprite.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
            sprite.body.velocity.x = 200;
        }

        if (cursors.up.isDown)
        {
            sprite.body.velocity.y = -200;
        }
        else if (cursors.down.isDown)
        {
            sprite.body.velocity.y = 200;
        }

    }

    render() {

    }

    collisionHandler (player: Phaser.Sprite, veg: Phaser.Sprite) {

        //  If the player collides with the chillis then they get eaten :)
        //  The chilli frame ID is 17

        if (veg.frame === 17)
        {
            veg.kill();
        }

    }
}