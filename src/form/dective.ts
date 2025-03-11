import { Directive } from 'vue'
import { Base } from './base'
export const dectiveEl = (instance: Base, name: string): Directive => {
    let obj: Directive = {
        mounted(el, elIns) {
            console.log(el, elIns, 'testIns')//
        },
        unmounted() { }
    }
    return obj
}