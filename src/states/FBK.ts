import once from 'lodash.once'
import autobind from 'autobind-decorator'

import Person from './Person'
import store from '../store'

import {
    PERSON,
    ENEMY_TYPES,
    MOOD,
    DEACTIVATE_TIME_FOR_COLLIDE_PERSON_POLICEMAN,
    ground,
    STATES
} from '../constants/constants'

import { throwCactus, changeMoney, reduceMood, changeMood, renderCrowd, gameEnd } from '../actions'
import { PubSub } from './Pubsub';

interface FBKProps {
    readonly game: Phaser.Game,
    // readonly onThrowCactus: (
    //     x:number, 
    //     y:number, 
    //     velocityX: number, 
    //     angularVelocity: number
    // ) => void
}
interface CollideEventProps {
    readonly type: ENEMY_TYPES
}


const COUNT_JUMPING_TRIALS = 2


export default class FBK extends Person {
    isTouchedEnemy: boolean = false
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
    // private onThrowCactus: (x: number, y: number, velocityX: number, angularVelocity: number) => void
    private animationsRunRight: Phaser.Animation
    private animationsJump: Phaser.Animation
    private animationsStand: Phaser.Animation
    countJumps: number = 0
    // private collideWithEnemy: (enemies: any, person: Phaser.Sprite, enemy:Phaser.Sprite) => void

    constructor( {
        game, 
        // onThrowCactus 
    }: FBKProps) {
        
        super({
            game: game,
            x: 0,
            y: game.world.height - ground.height,
            key: 'person'
        });
        
        this.game = game;
        this.time = Date.now();

        this.sprite.width = PERSON.width;
        this.sprite.height = PERSON.height;
        
        this.sprite.anchor.set(0.5, 1);
        this.sprite.body.setSize(PERSON.width, PERSON.height, 20, 17) 
        // this.sprite.scale.setTo(PERSON.setTo[0], PERSON.setTo[1]);
        // this.sprite.body.offset.y = this.sprite.body.offset.y - 18;

        this.animationsRunRight = this.sprite.animations.add(
            'run',
            PERSON.tweenSettings.run.frames,
            PERSON.tweenSettings.run.frameRate,
            true
        );
        this.animationsJump = this.sprite.animations.add(
            'jump', 
            PERSON.tweenSettings.jump.frames, 
            PERSON.tweenSettings.jump.frameRate, 
            true
        );
        this.animationsStand = this.sprite.animations.add(
            'stand', 
            PERSON.tweenSettings.stand.frames, 
            PERSON.tweenSettings.stand.frameRate, 
            true
        );
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.y = 3000;
        // this.sprite.body.immovable = true;
        // this.sprite.body.allowGravity = true; 

        this.sprite.animations.play('stand');
        this.sprite.body.collideWorldBounds = true;
        
        this.game.camera.follow(this.sprite);
        this.initiateKeyboardEvents()   
    }

    initiateKeyboardEvents = () => {
        this.keys = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            a: this.game.input.keyboard.addKey(Phaser.Keyboard.A), //throw
            d: this.game.input.keyboard.addKey(Phaser.Keyboard.D) //delete
        }
    }

    render() {
        // this.game.debug.body(this.sprite);
    }

    @autobind
    collideWithEnemy(collideProps: CollideEventProps) {
        const state = store.getState();
        switch(collideProps.type) {
            case ENEMY_TYPES.fsb:
                if (!this.isTouchedEnemy) {
                    state.dispatch(changeMoney(-10))
                    this.addDisabledAnimation()
                }
                break;
            case ENEMY_TYPES.gangster:
            case ENEMY_TYPES.official:
                state.dispatch(changeMoney(-10))
                this.deactivateForTime();
                break;
            case ENEMY_TYPES.policeman:
                if (!this.isTouchedEnemy) {
                    this.addDisabledAnimation()
                    this.reduceMood(ENEMY_TYPES.policeman);
                    store.dispatch(changeMood({
                        incr: -MOOD.step
                    }))
                    break;
                }
            default: break;
        }
    }

    deactivateForTime() {
        this.timer = this.game.time.events.loop(2000, this.activate, this);
    }

    addDisabledAnimation() {
        this.isTouchedEnemy = true;
        this.tween = this.game.add.tween(this.sprite).to(
            { alpha: 0 },
            300, Phaser.Easing.Linear.None, true, 0, 100, false
        );

        this.timer = this.game.time.events.loop(
            DEACTIVATE_TIME_FOR_COLLIDE_PERSON_POLICEMAN, 
            this.finishCollision, 
            this
        )

        this.animationsStand.play()
        this.sprite.body.velocity.x = -1 * Math.abs(this.sprite.body.velocity.x);
    }
    
    
    renderCrowd = once(() => {
        store.dispatch(renderCrowd())
    })

    update() {
        let cursors = this.keys;
        let player = this.sprite;
        let jumpButton = this.keys.up;
        if (this.sprite.position.x >= ground.width/2) {
            this.renderCrowd()
        }
        if (!this.isTouchedEnemy) {
            player.body.velocity.x = 0;
            if (cursors.left.isDown) {
                this.direction = -1
                player.body.velocity.x = -PERSON.velocityX;

                if (this.facing != 'left' || player.body.touching.down || player.body.onFloor())
                {
                    this.sprite.scale.setTo(-Math.abs(this.sprite.scale.x), this.sprite.scale.y);
                    player.animations.play('run');
                    this.facing = 'left';
                }
            } else if (cursors.right.isDown) {
                player.body.velocity.x = PERSON.velocityX;
                this.direction = 1 
                if (this.facing != 'right' || player.body.touching.down || player.body.onFloor())
                {
                    this.sprite.scale.setTo(Math.abs(this.sprite.scale.x), this.sprite.scale.y);
                    player.animations.play('run');
                    this.facing = 'right';
                }
            } else {
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
                        this.countJumps = 0
                    }
                }
            }

            if (jumpButton.isDown)
            {
                this.countJumps++
                if (this.countJumps < COUNT_JUMPING_TRIALS || !this.isJumping) {
                    player.animations.play('jump');
                    player.body.velocity.y = player.body.velocity.y - PERSON.velocityY;
                    this.isJumping = true;
                }
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
        this.isTouchedEnemy = false;
    }

    public throwCactus() {
        store.dispatch(throwCactus());
        PubSub.publish({
            x: this.sprite.position.x,
            y: this.sprite.worldPosition.y - this.sprite.body.height,
            velocityX: this.direction * PERSON.velocityX,
            angularVelocity: 100
        })
        
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

    public collideFinalPoints = once(() => {
        store.dispatch(gameEnd())
        this.game.state.start(STATES.Finish)
    })
}
