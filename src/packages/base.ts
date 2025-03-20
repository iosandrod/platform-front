import { nanoid } from "nanoid"
import { reactive, shallowRef, toRaw } from "vue"
import { uniqueId } from 'xe-utils'
import { FormInstance } from 'element-plus'
import hooks from '@ER/hooks'
export class Base {
    hooks:typeof hooks = shallowRef(hooks) as any
    id: string
    refPool: any = shallowRef({}) as any
    _refPool: any = shallowRef({}) as any
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
    onUnmounted() {
        let allKeys = Object.keys(this._refPool)
        for (const key of allKeys) {
            this.unregisterRef(key)//
        }//
    }
    getRef(key: keyof this["_refPool"]) {
        return this.refPool[this._refPool[key]]//
    }
}