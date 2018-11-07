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
            return name+'_'+(++id);
        }
    }
}

export const getRandom = () => Boolean(Math.round(Math.random()))