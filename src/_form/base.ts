import { } from 'vxe-table';
import { uniqueId } from 'xe-utils';
import { provide, withDirectives, inject, computed, isRef, ref, getCurrentInstance, watch, reactive } from 'vue';
import * as utils from './utils'
import _ from 'lodash'//
import locale from './locale'
import dayjs from 'dayjs';
import { areaList } from '@vant/area-data'
import Region from './Region';
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup({
    ...preset(),
    insertionPoint: document.getElementById('Everright-formEditor-point')
})
const sheet = jss.createStyleSheet({
}, {
    classNamePrefix: 'ER-'
}).attach()
export class Base {
    hookIns: Hook
    injectPool: any = {};
    props?: any
    hookCache: any = {}
    constructor(config: any) {
        this.hookIns = new Hook(this)
        this.props = config//
        return reactive(this)//
    }
    registerElement(name: string, el) {
        let now = uniqueId();
        let _this: any = this
        let elementPool = _this.elementPool;
        let elementMap = _this.elementMap;
        elementMap[name] = now;//
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
    useHook(...args) {
        let _args = [...args]
        let _args1 = _args.slice(1)
        let config = _args[0]
        let hookName = null
        let name = null
        if (typeof config == 'string') {
            hookName = config
            name = config
        } else {
            hookName = config.hookName
            name = config.name
        }
        let _hookIns = this.hookIns
        let useMethod = `use${hookName[0].toUpperCase() + hookName.slice(1)}`
        let method = _hookIns[useMethod]
        if (typeof method !== 'function') {
            return
        }
        let value = method.call(hookIns, ..._args1)
        let hookCache = this.hookCache
        hookCache[name] = value
    }
}
const isShowKeys = [
    'padding',
    'margin',
    'border',
    'background'
]

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
    renderTableBorder(style) {
        let result = {}
        const value = {
            width: style.borderWidth,
            style: 'solid',
            color: style.borderColor
        }
        switch (style.borderType) {
            case 0:
                break
            case 1:
                result = {
                    '&>table': {
                        border: value,
                        '& td': {
                            border: value
                        }
                    }
                }
                break
            case 2:
                result = {
                    '&>table': {
                        border: value,
                        '& td': {
                            border: {
                                style: 'none'
                            }
                        }
                    }
                }
                break
            case 3:
                result = {
                    '&>table': {
                        border: {
                            style: 'none'
                        },
                        '& td:not(`:last-child`)': {
                            borderRight: value
                        },
                        '& tr:not(:last-child)': {
                            '& td': {
                                borderBottom: value
                            }
                        }
                    }
                }
                break
            case 4:
                result = {
                    '&>table': {
                        border: {
                            style: 'none'
                        },
                        borderLeft: value,
                        '& td': {
                            border: {
                                style: 'none'
                            }
                        }
                    }
                }
                break
            case 5:
                result = {
                    '&>table': {
                        border: {
                            style: 'none'
                        },
                        borderRight: value,
                        '& td': {
                            border: {
                                style: 'none'
                            }
                        }
                    }
                }
                break
            case 6:
                result = {
                    '&>table': {
                        border: {
                            style: 'none'
                        },
                        borderTop: value,
                        '& td': {
                            border: {
                                style: 'none'
                            }
                        }
                    }
                }
                break
            case 7:
                result = {
                    '&>table': {
                        border: {
                            style: 'none'
                        },
                        borderBottom: value,
                        '& td': {
                            border: {
                                style: 'none'
                            }
                        }
                    }
                }
                break
        }
        return result
    }
    renderStyleSheets(node, uid, platform) {
        const style = _.cloneDeep(node.style)
        isShowKeys.forEach((key) => {
            if (key === 'border' && node.type === 'table') {
                if (style[`isShow${_.upperFirst(key)}`]) {
                    Object.assign(style, this.renderTableBorder(node.style))
                }
            } else {
                if (!(style[`isShow${_.upperFirst(key)}`])) {
                    delete style[key]
                    if (key === 'border') {
                        delete style.borderRadius
                    }
                    delete style[`isShow${_.upperFirst(key)}`]
                }
            }
        })
        if (_.isObject(node.style.width)) {
            delete style.width
            style.width = node.style.width[platform]
        }
        if (style.background && style.background.image) {
            style.background.image = `url(${style.background.image})`
        }
        //@ts-ignore
        return sheet.addRule(uid.toString(), style).id
    }
    useCss(node, platform) {
        const id = ref('')
        const {
            uid
        } = getCurrentInstance()
        if (node.style) {
            watch(node.style, (newValue) => {
                if (!_.isEmpty(newValue)) {
                    id.value = this.renderStyleSheets(node, uid, platform)
                }
            }, {
                immediate: true
            })
        }
        return id
    }

    useNamespace(block, Namespace?: any) {
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
    useI18n(props?: any) {
        const ER = inject('Everright', { props })
        const lang = computed(() => {
            return ER.props.lang
        })
        return {
            lang,
            t(path, options?: any) {
                return utils.transferData(lang.value, path, locale, options)
            }
        }
    }
    getLogicStateByField(field, fieldsLogicState) {
        const fieldState = fieldsLogicState.get(field)
        const required = _.get(fieldState, 'required', undefined)
        const readOnly = _.get(fieldState, 'readOnly', undefined)
        return {
            required,
            readOnly
        }
    }
    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Finds the position of a node in its parent, given as a node object
     * @param {Object} node - The node to find the position of
     * @param {Object} parent - The parent node
     * @return {Object} x and y coordinates of the node in its parent
/******  d31366e1-0b52-4ac0-8374-f612beb7d012  *******/
    findPosition(node, parent) {
        for (let y = 0; y < parent.list.length; y++) {
            const row = parent.list[y]
            const x = row.indexOf(node)
            if (x !== -1) {
                return { x, y }
            }
        }

        return { x: -1, y: -1 }
    }
    addValidate(result, node, isPc, t, state, ExtraParams) {
        const {
            options
        } = node
        if (isPc) {
            result.prop = node.context && node.context.parents.map((e, index) => {
                let result = ''
                if (!index) {
                    result = e.context.parent.indexOf(e)
                } else {
                    const parent = e.context.parent
                    let nodes = []
                    if (parent.type === 'subform') {
                        const {
                            x,
                            y
                        } = this.findPosition(e, parent)
                        result += `list.${y}.${x}`
                    } else {
                        if (parent.columns) {
                            nodes = parent.columns
                            result += 'columns.'
                        } else if (parent.list) {
                            nodes = parent.list
                            result += 'list.'
                        } else if (parent.rows) {
                            nodes = parent.rows
                            result += 'rows.'
                        }
                        result += nodes.indexOf(e)
                    }
                }
                return result
            }).join('.') + '.options.defaultValue'
        }

        const obj: any = {
        }
        const validator = (...arg0) => new Promise((...arg1) => {
            const resolve = () => {
                //@ts-ignore
                arg1[0]()
            }
            const reject = isPc
                ? arg1[1]
                : (message) => {
                    obj.message = message
                    arg1[0](false)
                }
            let value = isPc ? arg0[1] : arg0[0]
            if (/^(signature|radio|checkbox|select|html)$/.test(node.type)) {
                value = options.defaultValue
            }
            const newValue = options.isShowTrim ? value.trim() : value
            if (node.type === 'subform') {
                const allFields = utils.findSubFormAllFields(node)
                if (result.required) {
                    if (allFields.length) {
                        if (allFields.some(e => utils.isEmpty(e.options.isShowTrim ? e.options.defaultValue.trim() : e.options.defaultValue))) {
                            reject(t('er.validateMsg.required'))
                        }
                    } else {
                        reject(t('er.validateMsg.required'))
                    }
                } else {
                    resolve()
                }
            } else {
                let isRequired = result.required
                if (state.mode === 'preview' && utils.checkIsInSubform(node)) {
                    const parent = node?.context?.parent?.context?.parent
                    if (parent) {
                        const {
                            readOnly,
                            required
                        } = this.getLogicStateByField(parent, state.fieldsLogicState)
                        const parentProps = this.useProps(state, parent, isPc, false, false, t, ExtraParams).value
                        if (required !== undefined) {
                            isRequired = parentProps.required
                        }
                    }
                }
                if (isRequired && node.type !== 'subform' && utils.isEmpty(newValue)) {
                    reject(t('er.validateMsg.required'))
                    return
                }
                if (/^(select|checkbox|radio)$/.test(node.type)) {
                    if ((_.isArray(node.options.defaultValue) ? node.options.defaultValue : [node.options.defaultValue]).includes('other')) {
                        const key = node.key + '_other'
                        if (!state.othersFiles[key]) {
                            reject(t('er.validateMsg.placeholder3'))
                            return false
                        }
                    }
                }
            }
            switch (node.type) {
                case 'input':
                    switch (options.renderType) {
                        case 1:
                            if (!!newValue && options.isShowWordLimit && newValue.length < options.min) {
                                reject(t('er.validateMsg.limitWord', { min: options.min }))
                            } else {
                                resolve()
                            }
                            break
                        case 2:
                            if (!!newValue && !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(newValue)) {
                                reject(t('er.validateMsg.email'))
                            } else {
                                resolve()
                            }
                            break
                        case 3:
                            if (!!newValue && !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(newValue)) {
                                reject(t('er.validateMsg.IdNumber'))
                            } else {
                                resolve()
                            }
                            break
                        case 4:
                            if (!!newValue && !/^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(newValue)) {
                                reject(t('er.validateMsg.phone'))
                            } else {
                                resolve()
                            }
                            break
                        case 5:
                            if (!!newValue && !/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(newValue)) {
                                reject(t('er.validateMsg.http'))
                            } else {
                                resolve()
                            }
                            break
                    }
                    break
                case 'textarea':
                    if (!!newValue && options.isShowWordLimit && newValue.length < options.min) {
                        reject(t('er.validateMsg.limitWord', { min: options.min }))
                    } else {
                        resolve()
                    }
                    break
                default:
                    resolve()
                    break
            }
        })
        if (isPc) {
            obj.required = options.required
            obj.asyncValidator = validator
        } else {
            obj.validator = validator
        }
        result.rules = [obj]
    }
    useProps(state, data, isPc = true, isRoot = false, specialHandling: any, t: any, ExtraParams: any) {
        if (!t) {
            t = this.useI18n().t
        }
        if (!ExtraParams) {
            ExtraParams = inject('EverrightExtraParams', {})
        }
        return computed(() => {
            let node = isRoot ? data.config : data
            let result: any = {}
            const platform = isPc ? 'pc' : 'mobile'
            if (isRoot) {
                if (isPc) {
                    result.model = data.store
                    result.size = node.pc.size
                    result.labelPosition = node[platform].labelPosition
                } else {
                    result.labelAlign = node[platform].labelPosition
                }
                return result
            }
            if (isRef(data)) {
                node = data.value
            }
            const {
                options
            } = node
            result = {
                label: options.isShowLabel ? node.label : '',
                disabled: options.disabled,
                placeholder: options.placeholder,
                clearable: options.clearable,
                required: options.required
            }
            if (state.mode === 'preview') {
                const {
                    readOnly,
                    required
                } = this.getLogicStateByField(node, state.fieldsLogicState)
                if (readOnly === undefined) {
                    result.disabled = options.disabled
                } else {
                    result.disabled = readOnly === 1
                }
                if (required === undefined) {
                    result.required = result.disabled ? false : result.required
                } else {
                    result.required = result.disabled ? false : required === 1
                }
                if (utils.checkIsInSubform(node)) {
                    const parent = node?.context?.parent?.context?.parent
                    if (parent) {
                        const {
                            readOnly,
                            required
                        } = this.getLogicStateByField(node, state.fieldsLogicState)
                        const parentProps = this.useProps(state, parent, isPc, false, false, t, ExtraParams).value
                        if (readOnly !== undefined) {
                            result.disabled = parentProps.disabled
                        }
                        if (required !== undefined) {
                            result.required = parentProps.required
                        }
                    }
                }
            }
            try {
                if (ExtraParams.inSubformDefaultValueComponent) {
                    result.disabled = result.required = false
                }
            } catch (e) {
            }
            this.addValidate(result, node, isPc, t, state, ExtraParams)
            if (isPc) {
                result.labelWidth = options.isShowLabel ? options.labelWidth + 'px' : 'auto'
            }
            switch (node.type) {
                case 'input':
                    if (options.isShowWordLimit) {
                        result.maxlength = options.max
                        result['show-word-limit'] = options.isShowWordLimit
                    }
                    if (isPc) {
                        result.showPassword = options.showPassword
                        result.prepend = options.prepend
                        result.append = options.append
                    } else {
                        if (options.showPassword) {
                            result.type = 'password'
                        }
                        if (options.renderType === 4) {
                            result.type = 'tel'
                        }
                    }
                    break
                case 'textarea':
                    if (options.isShowWordLimit) {
                        result.maxlength = options.max
                        result['show-word-limit'] = options.isShowWordLimit
                    }
                    result.type = 'textarea'
                    result.rows = options.rows
                    break
                case 'number':
                    if (isPc) {
                        result.controls = options.controls
                        if (options.controls) {
                            result['controls-position'] = options.controlsPosition ? 'right' : ''
                        }
                    } else {
                        // result.inputWidth = '100px'
                        result.defaultValue = null
                        result.allowEmpty = true
                    }
                    if (options.isShowWordLimit) {
                        result.min = options.min
                        result.max = options.max
                    } else {
                        result.min = Number.NEGATIVE_INFINITY
                        result.max = Number.POSITIVE_INFINITY
                    }
                    result.step = options.step
                    result.precision = options.precision
                    break
                case 'radio':
                case 'checkbox':
                    result.options = _.get(state, `data[${options.dataKey}].list`, [])
                    break
                case 'select':
                    result.options = _.get(state, `data[${options.dataKey}].list`, [])
                    result.multiple = options.multiple
                    result.filterable = options.filterable
                    break
                case 'time':
                    result.format = options.format
                    if (isPc) {
                        result.valueFormat = options.valueFormat
                    }
                    break
                case 'date':
                    result.placeholder = options.placeholder
                    // result.startPlaceholder = options.startPlaceholder
                    // result.endPlaceholder = options.endPlaceholder
                    result.format = options.format
                    result.type = options.type
                    if (isPc) {
                        result.valueFormat = 'X'
                        if (options.type === 'daterange') {
                            result.rangeSeparator = ''
                            result.startPlaceholder = options.placeholder
                        }
                        result.disabledDate = (time) => {
                            const {
                                startTime,
                                endTime,
                                isShowWeeksLimit
                            } = options
                            const startDate = dayjs.unix(startTime)
                            const endDate = dayjs.unix(endTime)
                            const currentDate = dayjs(time)
                            let result = false
                            if (options.isShowWordLimit) {
                                result = currentDate.isBefore(startDate) || currentDate.isAfter(endDate)
                            }
                            return result
                        }
                    } else {
                        const {
                            startTime,
                            endTime,
                            isShowWeeksLimit
                        } = options
                        switch (options.type) {
                            case 'date':
                            case 'datetime':
                                if (startTime && options.isShowWordLimit) {
                                    result.minDate = dayjs.unix(startTime).toDate()
                                } else {
                                    result.minDate = dayjs.unix(0).toDate()
                                }
                                if (endTime && options.isShowWordLimit) {
                                    result.maxDate = dayjs.unix(endTime).toDate()
                                } else {
                                    result.maxDate = dayjs().add(20, 'year').toDate()
                                }
                                break
                            case 'dates':
                                if (_.isEmpty(options.defaultValue)) {
                                    result.defaultDate = null
                                } else {
                                    options.defaultValue.map(e => dayjs.unix(e).toDate())
                                }
                                if (startTime && options.isShowWordLimit) {
                                    result.minDate = dayjs.unix(startTime).toDate()
                                } else {
                                    result.minDate = dayjs().subtract(1, 'year').toDate()
                                }
                                if (endTime && options.isShowWordLimit) {
                                    result.maxDate = dayjs.unix(endTime).toDate()
                                } else {
                                    result.maxDate = dayjs().add(1, 'year').toDate()
                                }
                                break
                            case 'daterange':
                                if (options.defaultValue) {
                                    result.defaultDate = options.defaultValue.map(e => dayjs.unix(e).toDate())
                                } else {
                                    result.defaultDate = null
                                }
                                if (startTime && options.isShowWordLimit) {
                                    result.minDate = dayjs.unix(startTime).toDate()
                                } else {
                                    result.minDate = dayjs().subtract(1, 'year').toDate()
                                }
                                if (endTime && options.isShowWordLimit) {
                                    result.maxDate = dayjs.unix(endTime).toDate()
                                } else {
                                    result.maxDate = dayjs().add(1, 'year').toDate()
                                }
                                break
                        }
                    }
                    break
                case 'cascader':
                    result.options = _.get(state, `data[${options.dataKey}].list`, [])
                    result.props = {
                        multiple: options.multiple,
                        checkStrictly: options.checkStrictly
                    }
                    // result.options = options.options
                    break
                case 'slider':
                    result.step = options.step
                    result.min = options.min
                    result.max = options.max
                    break
                case 'divider':
                    result.contentPosition = options.contentPosition
                    break
                case 'rate':
                    result.allowHalf = options.allowHalf
                    if (!isPc) {
                        result.count = options.max
                    } else {
                        result.max = options.max
                    }
                    break
                case 'html':
                    result.type = 'textarea'
                    result.rows = 4
                    result.action = options.action
                    result.maxSize = options.size * 1024 * 1024
                    result.config = {
                        placeholder: options.placeholder
                    }
                    if (!isPc) {
                        result.config.toolbar = {
                            items: [
                                'formattingOptions',
                                '|',
                                'uploadImage',
                                'bold',
                                'italic',
                                'underline',
                                'strikethrough',
                                'link',
                                'undo',
                                'redo'
                            ]
                        }
                        result.config.formattingOptions = [
                            'fontFamily',
                            'fontSize',
                            'fontColor',
                            'fontBackgroundColor',
                            '|',
                            'alignment',
                            'blockQuote',
                            '|',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'outdent',
                            'indent',
                            '|',
                            'insertTable',
                            'removeFormat'
                        ]
                    }
                    break
                case 'uploadfile':
                    result.multiple = options.multiple
                    result.action = options.action
                    // result.size = options.size
                    result.accept = options.accept
                    result.maxSize = options.size * 1024 * 1024
                    if (isPc) {
                        result.limit = options.limit
                    } else {
                        result.maxCount = options.limit
                        result.onOversize = (file) => {
                            // showToast(t('er.validateMsg.fileSize', { size: options.size }))
                        }
                    }
                    break
                case 'region':
                    if (isPc) {
                        const region = new Region(areaList, {
                            isFilter: false,
                            selectType: options.selectType
                        })
                        result.options = region.getAll()
                        result.props = {
                            emitPath: false
                        }
                        result.filterable = options.filterable
                    } else {
                        result.areaList = areaList
                        result.columnsNum = options.selectType
                    }
                    break
            }
            specialHandling && specialHandling(node.type, result)
            return result
        })
    }


}

export const hookIns = new Hook({})