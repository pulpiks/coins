import autobind from 'autobind-decorator'

import Person from './Person'
import store from '../store'

import {
    PERSON,
    ENEMY_TYPES
} from '../constants/constants'

import { throwCactus, changeMoney, reduceMood } from '../actions'

interface FBKProps {
    readonly game: Phaser.Game,
    readonly onThrowCactus: (
        x:number, 
        y:number, 
        velocityX: number, 
        angularVelocity: number
    ) => void
}

export default class FBK extends Person {
    isTouchedEnemy: boolean
    game: Phaser.Game
    sprite: Phaser.Sprite
    tween: Phaser.Tween
    time: number
    cactuses: Phaser.Sprite[] = []
    private isJumping:boolean = false
    private facing: string = 'right'
    private direction: number = 1
    private timer: Phaser.TimerEvent
    private keys: {[key: string]: Phaser.Key}
    private onThrowCactus: (x: number, y: number, velocityX: number, angularVelocity: number) => void
    private isEnabledCollision: boolean
    private animationsRunRight: Phaser.Animation
    private animationsJump: Phaser.Animation
    private animationsStand: Phaser.Animation
    // private collideWithEnemy: (enemies: any, person: Phaser.Sprite, enemy:Phaser.Sprite) => void

    constructor( {
        game, 
        onThrowCactus 
    }: FBKProps) {
        
        super({
            game: game,
            x: 0,
            y: game.world.height-50,
            key: 'person'
        });
        
        this.game = game;
        this.isTouchedEnemy = false;
        this.time = Date.now();
        this.onThrowCactus = onThrowCactus;

        // this.sprite = this.game.add.sprite(0, this.game.world.height-50, 'person');

        this.animationsRunRight = this.sprite.animations.add('run', [8, 9, 10, 11], 10, true);
        this.animationsJump = this.sprite.animations.add('jump', [4], 20, true);
        this.animationsStand = this.sprite.animations.add('stand', [0], 20, true);
        this.sprite.width = PERSON.width;
        this.sprite.height = PERSON.height;
        this.sprite.scale.setTo(0.6, 0.85);
        this.sprite.anchor.set(0.5, 1);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.y = 3000;
        // this.sprite.body.immovable = true;
        // this.sprite.body.allowGravity = true; 

        this.sprite.animations.play('stand');
        //
        this.sprite.body.collideWorldBounds = true;
        
        this.keys = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        };

        this.game.camera.follow(this.sprite);
        this.keys = {
            ...this.keys,
            a: this.game.input.keyboard.addKey(Phaser.Keyboard.A), //throw
            d: this.game.input.keyboard.addKey(Phaser.Keyboard.D) //delete
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
                this.cactuses.pop();
                this.throwCactus();
            }
        }
    }

    @autobind
    collideWithEnemy(
        enemies: any, 
        person: Phaser.Sprite, 
        enemy:Phaser.Sprite
    ) {
        const state = store.getState();
        switch(state.enemy.type) {
            case ENEMY_TYPES.fsb:
                if (!this.isTouchedEnemy && !enemies[enemy.name].isDisabled) {
                    state.dispatch(changeMoney(10))
                    this.addDisabledAnimation();
                }
                break;
            case ENEMY_TYPES.gangster:
            case ENEMY_TYPES.official:
                if (!this.isEnabledCollision) {
                    state.dispatch(changeMoney(-10))
                    this.deactivateForTime();
                }
                break;
            case ENEMY_TYPES.policeman:
                this.reduceMood(ENEMY_TYPES.policeman);
                break;
            default: break;
        }
    }

    deactivateForTime() {
        this.isEnabledCollision = true;
        this.timer = this.game.time.events.loop(2000, this.activate, this);
    }

    addDisabledAnimation() {
        this.isTouchedEnemy = true;
        this.tween = this.game.add.tween(this.sprite).to(
            { alpha: 0 },
            300, Phaser.Easing.Linear.None, true, 0, 100, false
        );

        this.timer = this.game.time.events.loop(2000, this.finishCollision, this);
        this.sprite.body.velocity.x = -1 * Math.abs(this.sprite.body.velocity.x);
    }

    getScale() {
        return {
            x: this.sprite.scale.x,
            y: this.sprite.scale.y
        }
    }

    update() {
        let cursors = this.keys;
        let player = this.sprite;
        let jumpButton = this.keys.up;
        if (!this.isTouchedEnemy) {

            player.body.velocity.x = 0;

            if (cursors.left.isDown)
            {
                player.body.velocity.x = -200;

                if (this.facing != 'left' || player.body.touching.down || player.body.onFloor())
                {
                    this.sprite.scale.setTo(-Math.abs(this.sprite.scale.x), this.sprite.scale.y);
                    player.animations.play('run');
                    this.facing = 'left';
                }
            }
            else if (cursors.right.isDown)
            {
                player.body.velocity.x = 200;
                if (this.facing != 'right' || player.body.touching.down || player.body.onFloor())
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
                    player.frame = 0;
                    this.facing = 'idle';
                }
                else {
                    if ( player.body.touching.down || player.body.onFloor() ) {
                        player.frame = 0;
                        this.facing = 'idle';
                    }
                }
            }

            if (jumpButton.isDown && !this.isJumping)
            {
                player.animations.play('jump');
                player.body.velocity.y = -700;
                this.isJumping = true;
            }

            const state = store.getState();
            if (state.score.cactuses > 0 && this.keys.a.justDown) {
                this.throwCactus();
            }
        }
    }

    finishCollision() {
       this.endAnimation();
       this.activate();
    }


    endAnimation() {
        this.sprite.alpha = 1;
        this.tween.stop();
    }

    activate() {
        this.game.time.events.remove(this.timer);
        this.isEnabledCollision = false;
    }

    throwCactus() {
        store.dispatch(throwCactus());

        this.onThrowCactus(
            this.sprite.body.x,
            this.sprite.body.y - this.sprite.body.halfHeight,
            this.direction * 200,
            100
        );
    }

    @autobind
    reduceMood(cause: string) {
        store.dispatch(reduceMood({
            cause
        }))
    }

    public endJumping() {
        this.isJumping = false;
        // if (this.sprite.body.checkCollision.down) {
        //     this.sprite.body.gravity.y = 0;
        // }
    }
}