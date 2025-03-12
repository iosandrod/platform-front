import { Directive } from 'vue'
import { Base } from './base'
export const directiveEl = (instance: Base, name: string, fn?: any): Directive => {
    let obj: Directive = {
        mounted(...args) {
            if (typeof fn === 'function') {
                let _value = fn(...args)
                if (_value != null) {
                    instance.registerElement(name, _value)
                }
            } else {
                instance.registerElement(name, args[0])//
            } 
        },
        unmounted() {
            instance.cancelElement(name)//
        }
    }
    return obj
}