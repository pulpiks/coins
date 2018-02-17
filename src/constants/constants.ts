export const COINS = {
    startSum: 1000
};

export const PERSON = {
    width: 40,
    height: 40,
    speed: 200
};

export const ENEMIES = {
    count: 5
};

export const enum ENEMY_TYPES {
    fsb = 'fsb',
    official = 'official',
    gangster = 'gangster',
    prosecutor = 'prosecutor'
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
    width: 16,
    height: 16
};


export const enum STATES {
    Game = 'Game',
    Finish = 'Finish'
}
