import EventEmitter from 'events'
import { reactive } from 'vue'
export class Base {
    event: EventEmitter
    constructor(config?: any) {//
        this.event = new EventEmitter();
        return reactive(this)
    }
}  