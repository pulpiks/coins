import { CACTUS } from '../constants/constants';

export default class Cactus {
    props: any;
    constructor(props) {
        this.props = props;
        this.props.cactus.width = 20;
        this.props.cactus.height = 40;

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
}