type SubscriberFunction = (args: any) => void

const PubSubFunction = () => {
    const subscribers: SubscriberFunction[] = []
    return {
        subscribe(fn: SubscriberFunction) {
            subscribers.push(fn)    
        },
        publish(...args : any[]) {
            subscribers.forEach(subscriber => {
                subscriber.call(this,  ...Array.prototype.slice.apply(args) )
            })
        }
    }
}

export const PubSub = PubSubFunction()