import { nanoid } from "nanoid"
import { reactive, shallowRef, toRaw } from "vue"
import { uniqueId } from 'xe-utils'
export class Base {
    id: string
    refPool: any = shallowRef({})
    _refPool: any = shallowRef({})
    uuid() {
        return nanoid()
    }
    constructor() {
        this.id = this.uuid()
        return reactive(this)//
    }
    registerRef(key: string, ref: any) {
        this.unregisterRef(key)//
        let id = this.uuid()
        this._refPool[key] = id
        this.refPool[id] = ref//
    }
    unregisterRef(key: string) {
        let id = this._refPool[key]
        if (id == null) {
            return
        }
        delete this._refPool[key]//
        delete this.refPool[id]//
    }
    getRef(key: string) {
        return this.refPool[this._refPool[key]]//
    }
}