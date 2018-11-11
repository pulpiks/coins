import { strEnumHelper } from "../utils/helpers"

export const COINS = {
    startSum: 1000
}

export const PERSON = {
    width: 40,
    height: 64,
    speed: 400,
}

export const POLICEMAN = {
    width: 100,
    height: 70,
    rangeX: [100, 1500],
    count: 5,
    speed_min: 1,
    speed_max: 40,
    time_threshold: 3000,
    time_disabled: 3000,
}


export const RANGE = [0, 1000]

export const backgroundColor = 'rgba(85, 154, 198, 30)'
export const ground = {
    width: 4000,
}

export const ENEMIES = {
    count: 10,
}

export const enum ENEMY_TYPES {
    fsb = 'fsb',
    official = 'official',
    gangster = 'gangster',
    prosecutor = 'prosecutor',
    policeman = 'policeman',
}

export const ENEMY = {
    width: 30,
    height: 90,
    speed_min: 0,
    speed_max: 200,
    speed: 200,
    time_threshold: 2000,
    time_disabled: 3000,
}


export const CACTUS = {
    width: 25,
    height: 30,
    count: 10,
}


export const enum STATES {
    Game = 'Game',
    Finish = 'Finish',
    Boot = 'Boot',
}


export const buildingIdsType = strEnumHelper(['school', 'innovation', 'ministerstvo', 'zakupki_and_tenderi'])

export type buildingIdsType = keyof typeof buildingIdsType
export const buildingIdsKeys = Object.keys(buildingIdsType).map((key: buildingIdsType) => buildingIdsType[key]).join(',')

export type buildingIdsInterface = {readonly [key in buildingIdsType]: any}

export const typesBuiding = {
    'school': 'big_school.png',
    'innovation': 'innovation_house.png',
    'ministerstvo': 'ministerstvo.png',
    'zakupki_and_tenderi': 'zakupki_and_tenderi.png',
}

export const orderBuidings: buildingIdsType[] = ["ministerstvo", "innovation", "zakupki_and_tenderi", "school"]

export const BUIDING_COORDS: buildingIdsInterface = {
    'ministerstvo': {
        position: {
            x: 100,
        },
        scale: {
            x: 0,
            y: 1,
        }
    },
    'innovation': {
        position: {
            x: 1100,
        },
        scale: {
            x: 0,
            y: 1,
        }
    },
    'zakupki_and_tenderi': {
        position: {
            x: 2000
        },
        scale: {
            x: 0,
            y: 1,
        }
    },
    'school': {
        position: {
            x: 3000,
        },
        scale: {
            x: 0,
            y: 1,
        }
    }
}

export const MOOD = {
    step : 10,
}

export const timeOutCollide = 3000


export const enum LayersIds {
    person = 'person',
    tilemap = 'tilemap',
    tiles = 'tiles',
    coin = 'coin',
    enemy = 'enemy',
    ground = 'ground',
    cactus = 'cactus',
    clouds = 'clouds',
    policeman = 'policeman',
    hands = 'hands',
    clerk = 'clerk',
}

export const FAIL_MSG = {
    mood: 'Терпеть и не сдаваться! Попробуйте еще раз!'
}

export const HANDS = {
    width: 60,
    height: 80
} 

export const HANDS_COORDS = [[629, 200]]