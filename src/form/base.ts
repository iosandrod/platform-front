import { } from 'vxe-table';
import { uniqueId } from 'xe-utils';
import { provide, withDirectives, inject, computed } from 'vue';
import * as utils from './utils'
import _ from 'lodash'//
export class Base {
    hookIns: Hook
    injectPool: any = {};
    constructor(config: any) {
        this.hookIns = new Hook(this)
    }
    registerInject(name: string, el) {
        let now = uniqueId();
        let _this: any = this
        let elementPool = _this.elementPool;
        let elementMap = _this.elementMap;
        elementMap[name] = now;
        elementPool[now] = el;
    }
    cancelElement(name: string) {
        let _this: any = this
        let now = _this.elementMap[name];
        let elementPool = _this.elementPool;
        let elementMap = _this.elementMap;
        delete elementMap[name];
        delete elementPool[now]; //
    }
    useElement(name: string) {
        let _this: any = this
        return _this.elementPool[_this.elementMap[name]];
    } //注销
    setup() { }
    useHook(name: string) {
        let _hook = new Hook(this, 'hook')
    }
}


const _bem = (
    namespace,
    block,
    blockSuffix,
    element,
    modifier
) => {
    let cls = `${namespace}-${block}`
    if (element) {
        cls += `__${element}`
    }
    if (modifier) {
        cls += `--${modifier}`
    }
    return cls
}

export class Hook {
    statePrefix = 'is-'
    instance: any = {}
    constructor(instance, name?: any) {
        this.instance = instance//
    }
    useNamespace(block, Namespace) {
        let defaultNamespace = Namespace
        let instance = this.instance
        //@ts-ignore
        defaultNamespace = defaultNamespace || instance.namespace || inject("editor")?.namespace//
        const namespace = `Everright-${defaultNamespace}`
        const b = (blockSuffix = '') =>
            _bem(namespace, block, blockSuffix, '', '')
        const e = (element) =>
            element ? _bem(namespace, block, '', element, '') : ''
        const is = (name, ...args) => {
            const state = args.length >= 1 ? args[0] : true
            return name && state ? `${this.statePrefix}${name}` : ''
        }
        return {
            namespace,
            b,
            e,
            is
        }
    }
    useTarget() {
        const {
            state,
            setSelection,
            props
        } = inject('Everright') || this.instance as any
        const selection = computed(() => {
            return state.selected
        })
        const isSelectAnyElement = computed(() => {
            return state.selected !== state.config
        },
        )
        const isSelectRoot = computed(() => {
            return state.selected === state.config
        })
        const type = computed(() => {
            return state.selected.type
        })
        const isSelectField = computed(() => {
            // return utils.checkIsField(type.value)
            return utils.checkIsField(state.selected)
        })
        const target = computed(() => {
            return state.selected
        })
        const col = computed(() => {
            return !_.isEmpty(state.selected) && state.selected.context.col
        })
        const checkTypeBySelected = (nodes = [], propType?: any) => {
            let result = false
            if (!_.isEmpty(state.selected)) {
                if (type.value) {
                    const fn = props.checkPropsBySelected(state.selected, propType)
                    // console.log(fn !== undefined ? fn : nodes.includes(type.value))
                    result = fn !== undefined ? fn : nodes.includes(type.value)
                } else {
                    result = nodes.includes(type.value)
                }
            }
            return result
        }
        const isSelectGrid = computed(() => {
            return checkTypeBySelected(['grid'])
        })
        const isSelectTabs = computed(() => {
            return checkTypeBySelected(['tabs'])
        })
        const isSelectCollapse = computed(() => {
            return checkTypeBySelected(['collapse'])
        })
        const isSelectTable = computed(() => {
            return checkTypeBySelected(['table'])
        })
        const isPc = computed(() => {
            return state.platform === 'pc'
        })
        const isEditModel = computed(() => {
            return /^(edit|config)$/.test(state.mode)
        })
        const isSelectSubform = computed(() => {
            return checkTypeBySelected(['subform'])
        })
        return {
            state,
            setSelection,
            type,
            col,
            selection,
            isSelectAnyElement,
            isSelectField,
            target,
            checkTypeBySelected,
            isSelectGrid,
            isSelectTabs,
            isSelectCollapse,
            isSelectTable,
            isSelectRoot,
            isPc,
            isEditModel,
            isSelectSubform
        }
    }
}