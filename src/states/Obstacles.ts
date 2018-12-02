import { obstaclesKeys, ground } from "../constants/constants";

interface Coord {
    readonly x: number
    readonly y: number
    readonly w: number
    readonly h: number
}

const coords = [
    {x: 900, y: 70, w: 200, h: 30},
    {x: 900, y: 200, w: 200, h: 30},
    {x: 1172, y: 130, w: 20, h: 30},
    {x: 1200, y: 240, w: 200, h: 30},
    {x: 3440, y: 50, w: 100, h: 30},
    {x: 3540, y: 80, w: 200, h: 30},
    {x: 3740, y: 110, w: 150, h: 40},
    {x: 3890, y: 150, w: 200, h: 30},
    {x: 4090, y: 180, w: 200, h: 30},
]

const imageObstacles = [
{
    key: obstaclesKeys.texture, 
    w: 300,
    h: 40,
    x: 1890,
    y: 0,
}, 
{
    key: obstaclesKeys.texture, 
    w: 150,
    h: 10,
    x: 2100,
    y: 100,
},
{
    key: obstaclesKeys.vasya, 
    w: 300,
    h: 40,
    x: 1374,
    y: 0,
}]

function renderObstacle(coord: Coord) {
    let graphics: Phaser.Graphics = this.game.make.graphics()
    graphics.beginFill(0x8C7272, 1)
    graphics.drawRect(0, 0, coord.w, coord.h)
    graphics.endFill()
    graphics.boundsPadding = 0;

    // Create an empty sprite as a container
    let shapeSprite = this.game.add.sprite(
        coord.x, 
        this.game.world.height - ground.height - coord.y - coord.h
    );

    // Add the graphics to the sprite as a child
    shapeSprite.addChild(graphics);
    this.group.add(shapeSprite)
    // this.game.physics.enable(shapeSprite, Phaser.Physics.ARCADE);
    shapeSprite.body.width = coord.w
    shapeSprite.body.height = coord.h
    shapeSprite.anchor.set(0, 0)
    shapeSprite.body.collideWorldBounds = true;
    shapeSprite.body.immovable = true
}



export function render(params?: any) {
    const group = this.game.add.physicsGroup(Phaser.Physics.ARCADE)
    const r = renderObstacle.bind({game: this.game as Phaser.Game, group})
    coords.forEach(coord => {
        r(coord)
    })

    imageObstacles.forEach((imageObstacle) => {
        const bmd = this.game.make.bitmapData(imageObstacle.w, imageObstacle.h)
        bmd.copy(imageObstacle.key)
        const sprite = this.game.add.sprite(imageObstacle.x, this.game.height - ground.height, imageObstacle.key)
        sprite.anchor.set(0, 1)
        group.add(sprite)
        if (imageObstacle.key === obstaclesKeys.vasya) {
            sprite.scale.set(0.24, 0.1)
        }
        sprite.body.immovable = true
    })

    return group
}