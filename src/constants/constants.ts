export const COINS = {
    startSum: 1000
};

export const PERSON = {
    width: 100,
    height: 64,
    speed: 400
};

export const POLICEMAN = {
    width: 100,
    height: 70,
    rangeX: [100, 1500],
    count: 5,
    speed_min: 1,
    speed_max: 40,
    speed: 200,
    time_threshold: 3000,
    time_disabled: 3000
};

export const RANGE = [0, 1000];

export const backgroundColor = 'rgba(85, 154, 198, 30)';
export const ground = {
    width: 4000
};

export const ENEMIES = {
    count: 5
};

export const enum ENEMY_TYPES {
    fsb = 'fsb',
    official = 'official',
    gangster = 'gangster',
    prosecutor = 'prosecutor',
    policeman = 'POLICEMAN'
}

export const ENEMY = {
    width: 30,
    height: 90,
    speed_min: 0,
    speed_max: 200,
    speed: 200,
    time_threshold: 2000,
    time_disabled: 3000
};


export const CACTUS = {
    width: 25,
    height: 30,
    count: 10
};


export const enum STATES {
    Game = 'Game',
    Finish = 'Finish',
    Boot = 'Boot'
}

export const typesBuiding = {
    "school": "big school.png",
    "house-black-silhouette": "house-black-silhouette.png",
    "innovation": "innovation house.png",
    "ministerstvo": "ministerstvo.png",
    "zakupki_and_tenderi": "zakupki_and_tenderi.png",
};

export const orderBuidings = ["ministerstvo", "innovation", "zakupki_and_tenderi", "house-black-silhouette", "school"];


export const BUIDING_COORDS = {
    "ministerstvo": {
        position: {
            x: 100
        },
        scale: {
            x: 0,
            y: 1
        }
    },
    "innovation": {
        position: {
            x: 1100
        },
        scale: {
            x: 0,
            y: 1
        }
    },
    "zakupki_and_tenderi": {
        position: {
            x: 2000
        },
        scale: {
            x: 0,
            y: 1
        }
    },
    "house-black-silhouette": {
        position: {
            x: 2900
        },
        scale: {
            x: 0,
            y: 1
        }
    }
};

export const SCHOOL_COORDS = {
    "school": 2000
};

export const MOOD = {
    step : 5
};

export const timeOutCollide = 3000;