export default class Player {
    constructor(game, options) {
        this.game = game;
        this.options = options;
        this.keys = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        };
    }

    move() {
        let cursors = this.keys;
        let player = this.sprite;
        let jumpButton = this.keys.up;

        if (!this.isTouchedEnemy) {

            player.body.velocity.x = 0;

            if (jumpButton.isDown && !this.isJumping)
            {
                player.animations.play('jump');
                player.body.velocity.y = -700;
                this.isJumping = true;
            }

            if (cursors.left.isDown)
            {
                player.body.velocity.x = -200;

                if (this.facing != 'left')
                {
                    this.sprite.scale.setTo(-Math.abs(this.sprite.scale.x), this.sprite.scale.y);
                    player.animations.play('run');
                    this.facing = 'left';
                }
            }
            else if (cursors.right.isDown)
            {
                player.body.velocity.x = 200;

                if (this.facing != 'right')
                {
                    this.sprite.scale.setTo(Math.abs(this.sprite.scale.x), this.sprite.scale.y);
                    player.animations.play('run');
                    this.facing = 'right';
                }
            }
            else
            {
                if (this.facing != 'idle')
                {
                    player.animations.stop();

                    if (this.facing == 'left')
                    {
                        player.frame = 0;
                    }
                    else
                    {
                        player.frame = 0;
                    }

                    this.facing = 'idle';
                }
            }

            if (this.cactuses.length > 0 && this.keys.a.justDown) {
                this.throwCactus(this.cactuses.pop());
            }
        }
    }

}