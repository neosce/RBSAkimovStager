import IEvent from './interfaces/IEvent';

export default class EventEmitter {
    private static instance: EventEmitter;
    private readonly events: IEvent;

    private constructor() {
        this.events = {};
    }

    public static getInstance(): EventEmitter {
        return !EventEmitter.instance ? (this.instance = new EventEmitter) : this.instance;
    }

    on(name: string, callback: Function, context: any = null) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name]
            .push(callback.bind(context));

        return () => {
            this.events[name] = this.events[name]
                .filter((cb: Function) => cb !== callback);
        };
    }

    emit(name: string, args?: any[], context: any = null) {
        const event = this.events[name];
        if (event) {
            event.forEach((fn: Function) => {
                fn.apply(context, args);
            })
        }
    }
}