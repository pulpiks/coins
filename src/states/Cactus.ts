import { CACTUS } from '../constants/constants';

import { generatorRandomString } from '../utils';

const generatorId = generatorRandomString();


export default class Cactus {
    props: any;
    name: string;

    constructor({ cactus, game }: { cactus:Phaser.Sprite, game:Phaser.State }) {
        cactus.width = 20;
        cactus.height = 40;
        cactus.body.immovable = true;
        cactus.name = 'cactus_'+ generatorId.getId();
        // this.game = game;
        // this.enemy = enemy;
        // this.person = person;
        // this.enemies = enemies;
        // this.enemySprite = this.enemies.create(
        //     this.enemy.x,
        //     this.enemy.y,
        //     'enemy'
        // );
        // this.enemySprite.width = CACTUS.width;
        // this.enemySprite.height = CACTUS.height;
        // this.enemySprite.name = 'cactus_'+ generatorId.getIdForEnemy();
        // this.enemySprite.anchor.set(0.5, 1);
        // // enemySprite.body.gravity.y = 200;
        // this.enemySprite.body.collideWorldBounds = true;
        // this.enemySprite.body.immovable = true;
        // this.timerChangingVelocity = Date.now();
    }

    touch(persionSprite: Phaser.Sprite, cactus: Phaser.Sprite) {
        console.log(persionSprite, cactus);
        cactus.destroy();
    }

    throwOne() {
        console.log('throw');
    }
}