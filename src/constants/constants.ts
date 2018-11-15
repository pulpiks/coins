import { strEnumHelper } from "../utils/helpers"
import { getRandomValueFromArray } from "../utils";

export const COINS = {
    startSum: 1000
}

export const PERSON = {
    width: 40,
    height: 64,
    speed: 400,
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

// export const ENEMY = {
//     width: 30,
//     height: 90,
//     speed_min: 0,
//     speed_max: 200,
//     speed: 200,
//     time_threshold: 2000,
//     time_disabled: 3000,
// }


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

export const TIMEOUT_COLLIDE_POLIMEN_CACTUS = 3000


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
    passer = 'passer'
}


export interface PasserConstantOptions {
    setTo: number[]
    stand: {
        frames: number[],
        frameRate: number
    },
    move: {
        frames: number[],
        frameRate: number
    }
}

export type PasserConstantType = {
    [k in string]: PasserConstantOptions
} 

const passerHeights = [0.1, 0.11, 0.101, 0.115]

export const passersConstants: PasserConstantType = {
   'usual-1': {
       setTo: [0.11, passerHeights[getRandomValueFromArray(passerHeights)]],
       stand: {
           frames: [8],
           frameRate: 1,
       }, 
       move: {
           frames: [0, 1, 2, 3, 4, 5, 6].reverse(),
           frameRate: 8
       }
   },
   'usual-2': {
        setTo: [0.1, 0.1],
        stand: {
            frames: [1],
            frameRate: 1,
        }, 
        move: {
            frames: [0, 1, 2, 3, 4, 5, 6, 7].reverse(),
            frameRate: 8
        }  
   },
   'sentsov': {
        setTo: [0.1, 0.1],
        stand: {
            frames: [1],
            frameRate: 1,
        }, 
        move: {
            frames: [0,1,2,3,4,5,6,7].reverse(),
            frameRate: 8
        } 
   },
   'pupil': {
        setTo: [0.09, 0.085],
        stand: {
            frames: [2],
            frameRate: 1,
        }, 
        move: {
            frames: [4,5,6,7, 0, 1, 2, 3].reverse(),
            frameRate: 8
        } 
   }
}

export const passersTypes = strEnumHelper(Object.keys(passersConstants))

export type passersIdsTypes = keyof typeof passersTypes



type PassersKeys = {
    readonly key: passersIdsTypes,
    readonly count: number,
}[]

export const passers: PassersKeys = [
    {key: 'usual-1', count: 3}, 
    {key: 'usual-2', count: 2}, 
    {key: 'sentsov', count: 5}, 
    {key: 'pupil', count: 10}
]

export const FAIL_MSG = {
    mood: 'Терпеть и не сдаваться! Попробуйте еще раз!'
}

export const HANDS = {
    width: 60,
    height: 80
} 

export const HANDS_COORDS = [[1230, 130], [2161, 200], [735, 200]]