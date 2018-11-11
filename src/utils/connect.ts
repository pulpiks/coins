

export function connect(stateFunction: any = null, _: any = null) {
    if (stateFunction) {
        stateFunction()
    }
}