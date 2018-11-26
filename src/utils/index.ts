const abc = 'sdkfjhskdf34234623V4sdfjgh234234JG3eu247y237RKWRG3U2YTGKUW7R234TGqwmjhegmqjrgea,jthlei485y3i4yr';

const getChar = () => abc[Math.round(Math.random()*(abc.length-1))];

export function getString(length:number = 8): string {

    let result = '';

    for (let i = 0; i < length; i++){
        result += getChar();
    }

    return result;
}


export function generatorRandomString() {
    let idsForEnemies: string[] = [];

    return {
        getId() {
            let id: string = getString();

            if (idsForEnemies.indexOf(id) >= 0) {
                this.getId();
            }
            else {
                idsForEnemies.push(id);
                return id;
            }
        }
    }
}


export const generatorId = () => {
    let id = 0;
    return {
        get: (name: string) => {
            return name+'-'+(++id);
        },
    }
}

export const getRandom = () => Boolean(Math.round(Math.random()))

export function deepFlatten<T>(arr: T[]): T[] { return [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)))}

export const getRandomValueFromArray = (arr: any[]) => Math.floor(Math.random() * arr.length)

export const sampleSize = ([...arr], n = 1) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr.slice(0, n);
  }


export const isDevelopment = process.env.DEVELOPMENT === 'true'


export const utils = {
    centerGameObjects: function (objects: any[]) {
      objects.forEach(function (object) {
        object.anchor.setTo(0.5);
      })
    }
};