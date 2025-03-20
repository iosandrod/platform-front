import { nanoid } from "nanoid"
import { reactive, shallowRef, toRaw } from "vue"
import { uniqueId } from 'xe-utils'
import { FormInstance } from 'element-plus'
import hooks from '@DESIGN/hooks'
export class Base {
    hooks: typeof hooks = shallowRef(hooks) as any
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
    registerRef(key: string, ref: any,) {
        let refPool = this.refPool
        refPool[key] = ref
    }
    unregisterRef(key: string, all = false, fn?: any) {
        let refPool = this.refPool
        let ref = refPool[key]
        if (ref == null) {
            delete refPool[key]
            return
        }
    }
    onMounted() {

    }
    onUnmounted() {
        let keys = Object.keys(this.refPool)
        for (const key of keys) {
            this.unregisterRef(key)//
        }//
    }
    getRef(key: any) {
        // return this.refPool[this._refPool[key]]//
        let refPool = this.refPool
        let arr = refPool[key]
        let item = arr.slice(-1).pop()
        return item//
    }
}