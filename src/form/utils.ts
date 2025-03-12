import _ from 'lodash'
import { globalConfig } from './config'
import { nanoid } from './nanoid'
import { reactive, toRaw, computed } from 'vue'
import dayjs from 'dayjs'
const fieldsRe = /^(input|textarea|number|radio|checkbox|select|time|date|rate|switch|slider|html|cascader|uploadfile|signature|region|subform)$/
const deepTraversal = (node, fn) => {
    fn(node)
    const nodes = node.type === 'subform' ? node.list[0] : (node.list || node.rows || node.columns || node.children || [])
    nodes.forEach(e => {
        deepTraversal(e, fn)
    })
}
const wrapElement = (element, fn) => {
    const result = element
    deepTraversal(result, (node) => {
        if (Array.isArray(node)) return false
        if (!node.style) {
            node.style = {}
        }
        if (!node.id) {
            node.id = nanoid()
        }
        if (!node.key) {
            node.key = `${node.type}_${node.id}`
        }
        if (/^(grid|tabs|collapse|table|divider)$/.test(node.type)) {
            node.style = {
                width: '100%'
            }
        }
        if (checkIsField(node)) {
            node.style = {
                width: {
                    pc: '100%',
                    mobile: '100%'
                }
            }
        }
        if (/^(tabs)$/.test(node.type)) {
            node.columns = new Array(3).fill('').map((e, index) => {
                const data: any = renderFieldData('tabsCol')
                data.label = `Tab ${index + 1}`
                data.options = {}
                return data
            })
        }
        if (/^(collapse)$/.test(node.type)) {
            node.columns = new Array(3).fill('').map((e, index) => {
                const data: any = renderFieldData('collapseCol')
                data.label = `Tab ${index + 1}`
                data.options = {}
                return data
            })
        }
        fn && fn(node)
    })
    return result
}
const renderFieldData = (type) => {
    const result = {
        id: nanoid(),
        type,
        label: '',
        list: [],
        style: {}
    }
    return result
}
const excludes = ['grid', 'col', 'table', 'tr', 'td', 'tabs', 'tabsCol', 'collapse', 'collapseCol', 'divider', 'inline']
const flatNodes = (nodes, excludes, fn?: any, excludesFn?: any) => {
    return nodes.reduce((res, node, currentIndex) => {
        if (excludes.indexOf(node.type) === -1) {
            res.push(node)
            fn && fn(nodes, node, currentIndex)
        } else {
            excludesFn && excludesFn(nodes, node, currentIndex)
        }
        const children = node.type === 'subform' ? node.list[0] : (node.list || node.rows || node.columns || node.children || [])
        res = res.concat(flatNodes(children, excludes, fn, excludesFn))
        return res
    }, [])
}
const getAllFields = (store) => flatNodes(store, excludes)
const pickfields = (list) => {
    return flatNodes(list, excludes)
}
const processField = (list) => flatNodes(list, excludes, (nodes, node, currentIndex) => {
    nodes[currentIndex] = node.id
})
const disassemblyData1 = (data) => {
    const result = {
        list: data.list,
        config: data.config,
        fields: processField(data.list),
        data: data.data,
        logic: data.logic
    }
    return result
}
const combinationData1 = (data) => {
    const result = {
        list: data.list,
        config: data.config,
        data: data.data,
        fields: data.fields,
        logic: data.logic
    }
    const fn = (nodes, node, currentIndex) => {
        const cur = _.find(data.fields, { id: node })
        if (!_.isEmpty(cur)) {
            if (cur.type === 'subform') {
                flatNodes(cur.list[0], excludes, fn)
            }
            nodes[currentIndex] = cur
        }
    }
    flatNodes(data.list, excludes, fn)
    return result
}
const combinationData2 = (list, fields,...ages) => {
    const fn = (nodes, node, currentIndex) => {
        const cur = _.find(fields, { id: node })
        if (!_.isEmpty(cur)) {
            if (cur.type === 'subform') {
                flatNodes(cur.list[0], excludes, fn)
            }
            nodes[currentIndex] = cur
        }
    }
    flatNodes(list, excludes, fn)
}
const repairLayout = (layout, fields) => {
    flatNodes(layout, excludes, (nodes, node, currentIndex) => {
        if (_.isString(node)) {
            if (!_.isEmpty(_.find(fields, { id: node }))) {
                nodes.splice(currentIndex, 1)
            }
        }
    })
    const temporary = []
    flatNodes(layout, excludes, null, (nodes, node, currentIndex) => {
        if (node.type === 'inline') {
            if (!node.columns.length) {
                temporary.unshift({
                    nodes,
                    currentIndex
                })
            }
        }
    })
    temporary.forEach(e => {
        e.nodes.splice(e.currentIndex, 1)
    })
}
const disassemblyData2 = (list) => {
    flatNodes(list, excludes, (nodes, node, currentIndex) => {
        nodes[currentIndex] = node.id && node.id
    })
}
const checkIslineChildren = (node) => node.context.parent.type === 'inline'
const checkIsField = (node) => fieldsRe.test(node.type)
const calculateAverage = (count, total = 100) => {
    const base = Number((total / count).toFixed(2))
    const result = []
    for (let i = 0; i < count; i++) {
        // result.push(base + (i < rest ? 1 : 0))
        result.push(base)
    }
    return result
}
const syncWidthByPlatform = (node, platform, syncFullplatform = false, value) => {
    // debugger
    const isArray = _.isArray(node)
    if (!isArray) {
        if (_.isObject(node.style.width)) {
            if (syncFullplatform) {
                node.style.width.pc = node.style.width.mobile = value + '%'
            } else {
                node.style.width[platform] = value + '%'
            }
        } else {
            node.style.width = value + '%'
        }
    }
    const otherNodes = isArray ? node : node.context.parent.columns.filter(e => e !== node)
    const averageWidths = calculateAverage(otherNodes.length, isArray ? 100 : 100 - value)
    otherNodes.forEach((node, index) => {
        const isFieldWidth = _.isObject(node.style.width)
        if (isFieldWidth) {
            if (syncFullplatform) {
                node.style.width.pc = node.style.width.mobile = averageWidths[index] + '%'
            } else {
                node.style.width[platform] = averageWidths[index] + '%'
            }
        } else {
            node.style.width = averageWidths[index] + '%'
        }
    })
}
const transferLabelPath = (node) => `er.fields.${node.type === 'input' ? `${node.type}.${node.options.renderType - 1}` : `${node.type}`}`
const fieldLabel = (t, node) => t(transferLabelPath(node))
const transferData = (lang, path, locale, options = {}) => {
    let result = ''
    if (_.isEmpty(options)) {
        result = _.get(locale[lang], path, '')
    } else {
        result = _.template(_.get(locale[lang], path, ''))(options)
    }
    return result
}
const isNull = (e) => e === '' || e === null || e === undefined
const checkIsInSubform = (node) => {
    if (!node) return false
    let result = false
    let parent = node.context.parent
    while (parent && !result) {
        if (parent.type === 'subform') {
            result = true
        }
        parent = parent.context?.parent
    }
    return result
}
const getSubFormValues = (subform) => subform.list.map(e => {
    const cur = {}
    const children = []
    e.forEach(e => {
        e.columns.forEach(e => {
            children.push(e)
        })
    })
    children.forEach(e => {
        cur[e.key] = e.options.defaultValue
    })
    return cur
})
const findSubFormAllFields = (subform) => {
    const result = []
    subform.list.forEach(e => {
        e.forEach(e => {
            result.push(...e.columns)
        })
    })
    return result
}
export const checkIdExistInLogic = (fieldId, logic) => {
    return new RegExp(`"${fieldId}"`).test(JSON.stringify(logic))
}
export const removeLogicDataByid = (fieldId, logic) => {
    for (const rules of Object.values(logic)) {
        //@ts-ignore
        for (let i0 = 0; i0 < rules.length; i0++) {
            const conditions = _.get(rules[i0], 'ifRules.filters[0].conditions', [])
            for (let i1 = 0; i1 < conditions.length; i1++) {
                if (conditions[i1].property === fieldId) {
                    conditions.splice(i1--, 1)
                }
            }
            if (!conditions.length) {
                //@ts-ignore
                rules.splice(i0--, 1)
            }
        }
    }
    for (const key in logic) {
        if (!logic[key].length) {
            delete logic[key]
        }
    }

    for (const rules of Object.values(logic)) {
        //@ts-ignore
        for (let i0 = 0; i0 < rules.length; i0++) {
            const conditions = _.get(rules[i0], 'thenRules.filters[0].conditions', [])
            for (let i1 = 0; i1 < conditions.length; i1++) {
                for (let i2 = 0; i2 < conditions[i1].value.length; i2++) {
                    if (conditions[i1].value[i2] === fieldId) {
                        conditions[i1].value.splice(i2--, 1)
                    }
                }
                if (!conditions[i1].value.length) {
                    conditions.splice(i1--, 1)
                }
            }
            if (!conditions.length) {
                //@ts-ignore
                rules.splice(i0--, 1)
            }
        }
    }
    for (const key in logic) {
        if (!logic[key].length) {
            delete logic[key]
        }
    }
}
export const generateOptions = (len) => {
    const result = []
    while (len--) {
        result.push({
            label: 'Option',
            value: nanoid()
        })
    }
    return result
}
export const generateData = (layoutType = 1) => {
    const result = {
        config: _.cloneDeep(globalConfig)
    }
    //@ts-ignore
    result.logic = result.data = {}
    if (layoutType === 1) {
        //@ts-ignore
        result.list = []
    }
    if (layoutType === 2) {
        //@ts-ignore
        result.layout = []
    }
    return result
}
const getNodes = (node, key) => {
    const {
        context: {
            root,
            col,
            row
        }
    } = node
    let nodes = []
    if (key === 'rowspan') {
        nodes = root.context.columns[col]
    } else if (key === 'colspan') {
        nodes = root.rows[row].columns
    }
    return nodes
}
const findNode = (node, dir, key, fn, ignore = false) => {
    const {
        context: {
            root,
            col,
            row
        }
    } = node
    let count = key === 'rowspan' ? row : col
    let passArr = []
    const nodes = getNodes(node, key)
    const callBack = () => {
        // rowspan
        if (key === 'rowspan') {
            passArr.forEach((e, index) => {
                e.options.rowspan = passArr.length
                e.options.isMerged = !!index
                if (e.options.colspan > 1) {
                    const nodes = getNodes(e, 'colspan')
                    nodes.slice(col + 1, col + e.options.colspan).forEach((e) => {
                        e.options.rowspan = passArr.length
                    })
                }
                if (index) {
                    passArr[0].list = passArr[0].list.concat(e.list)
                    e.list = []
                }
            })
        } else if (key === 'colspan') {
            passArr.forEach((e, index) => {
                e.options.colspan = passArr.length
                e.options.isMerged = !!index
                if (e.options.colspan > 1) {
                    const nodes = getNodes(e, 'rowspan')
                    nodes.slice(row + 1, row + e.options.rowspan).forEach((e) => {
                        e.options.colspan = passArr.length
                    })
                }
                if (index) {
                    passArr[0].list = passArr[0].list.concat(e.list)
                    //@ts-ignore
                    addContext(passArr[0], passArr[0].context.parent)
                    // console.log(passArr[0], passArr[0].context.parent)
                    e.list = []
                }
            })
        }
    }
    if (dir === 'after') {
        while (++count) {
            const item = nodes[count]
            if (!item) {
                fn(passArr)
                break
            }
            passArr.push(item)
            if (!item.options.isMerged) {
                if (item.options[key] > 1) {
                    const lastNode = passArr[passArr.length - 1]
                    passArr = passArr.concat(nodes.slice(lastNode.context[key.slice(0, 3)] + 1, lastNode.context[key.slice(0, 3)] + item.options[key]))
                }
                passArr.unshift(node)
                fn(passArr, callBack)
                break
            }
        }
    } else {
        while (count--) {
            const item = nodes[count]
            if (!item) {
                fn(passArr)
                break
            }
            let arr = []
            passArr.unshift(item)
            if (!item.options.isMerged) {
                if (node.options[key] > 1) {
                    findNode(passArr[0], 'after', key, (nodes) => {
                        arr = nodes
                    })
                }
                passArr.push(node)
                if (arr.length) {
                    passArr = arr
                }
                fn(passArr, callBack)
                break
            }
        }
    }
}

const getValidNode = (node) => {
    const {
        context: {
            root,
            col,
            row
        }
    } = node
    const result = []
    const rows = root.rows
    for (let i0 = 0; i0 < rows.length; i0++) {
        for (let i1 = 0; i1 < rows[i0].columns.length; i1++) {
            const item = rows[i0].columns[i1]
            if (!item.options.isMerged) {
                result.push(item)
            }
        }
    }
    return result.filter((e) => {
        const {
            context: {
                root,
                col,
                row
            },
            options: {
                colspan,
                rowspan
            }
        } = e
        const offsetx = [col, col + (colspan > 1 ? colspan - 1 : 0)]
        const offsety = [row, row + (rowspan > 1 ? rowspan - 1 : 0)]
        const status = node.context.col >= offsetx[0] && node.context.col <= offsetx[1] && node.context.row >= offsety[0] && node.context.row <= offsety[1]
        // if (status) {
        //   console.log(offsetx)
        //   console.log(offsety)
        //   console.log(col)
        //   console.log(row)
        // }
        return status
    })[0]
}
const checkStatus = (nodes, node, key) => {
    const data = {
        x: -1,
        y: -1,
        status: -1
    }
    for (let i0 = 0; i0 < nodes.length; i0++) {
        for (let i1 = 0; i1 < nodes[i0].length; i1++) {
            if (nodes[i0][i1].id === node.id) {
                data.x = i1
                data.y = i0
                if (key === 'colspan') {
                    if (nodes[i0].length === 1) {
                        data.status = 0
                    } else {
                        if (i1 === nodes[i0].length - 1) {
                            data.status = 3
                        }
                        if (i1 === 0) {
                            data.status = 1
                        }
                        if (i1 > 0 && i1 < nodes[i0].length - 1) {
                            data.status = 2
                        }
                    }
                } else {
                    if (nodes.length === 1) {
                        data.status = 0
                    } else {
                        if (i0 === nodes.length - 1) {
                            data.status = 3
                        }
                        if (i0 === 0) {
                            data.status = 1
                        }
                        if (i0 > 0 && i0 < nodes.length - 1) {
                            data.status = 2
                        }
                    }
                }
            }
        }
    }
    return data
}
const getNodeRange = (node) => {
    const {
        context: {
            root,
            col,
            row
        },
        options: {
            rowspan,
            colspan
        }
    } = node
    let count = row
    const xNodes = root.rows[row].columns
    const yNodes = root.context.columns[col]
    const result = [] // x , y
    while (count < row + rowspan) {
        result.push([...root.rows[count].columns.slice(col, col + colspan)])
        count++
    }
    return result
}
const appendNodes = (node, dir, key) => {
    const {
        context: {
            root,
            col,
            row
        },
        options: {
            colspan,
            rowspan
        }
    } = node
    let index = -1
    let nodes = []
    if (dir === 'before') {
        if (key === 'colspan') {
            index = col
            if (index !== 0) {
                nodes = root.context.columns[index - 1]
            } else {
                nodes = root.context.columns[0]
            }
        } else {
            index = row
            if (index !== 0) {
                nodes = root.rows[index - 1].columns
            }
        }
    } else {
        if (key === 'colspan') {
            if (node.options.colspan > 1) {
                index = col + colspan - 1
            } else {
                index = col
            }
            nodes = root.context.columns[index]
        } else {
            if (node.options.rowspan > 1) {
                index = row + rowspan - 1
            } else {
                index = row
            }
            nodes = root.rows[index].columns
        }
    }
    if (key === 'colspan') {
        nodes.forEach((e, index0) => {
            //@ts-ignore
            const newNode = wrapElement({
                type: 'td',
                options: {
                    colspan: 1,
                    rowspan: 1,
                    isMerged: false
                },
                list: [],
                style: {}
            })

            e.context.parent.columns.splice(dir === 'before' ? index : index + 1, 0, newNode)
            //@ts-ignore
            addContext(e.context.parent, root)
            if (!(index === 0 && dir === 'before')) {
                const validNode = getValidNode(e)
                const ranges = getNodeRange(validNode)
                const {
                    status,
                    x,
                    y
                } = checkStatus(ranges, e, 'colspan')
                //@ts-ignore
                if (/[1, 2]/.test(status)) {
                    newNode.options.isMerged = true
                    ranges[y].forEach(e => {
                        e.options.colspan = newNode.options.colspan = ranges[y].length + (y === 0 ? 1 : 0)
                        newNode.options.rowspan = e.options.rowspan
                    })
                }
            }
        })
    } else {
        const arr = nodes.map((e) => {
            const validNode = getValidNode(e)
            const ranges = getNodeRange(validNode)
            return {
                ...checkStatus(ranges, e, 'rowspan'),
                ranges
            }
        })
        //@ts-ignore
        const tr = wrapElement({
            type: 'tr',
            columns: Array.from(Array(node.context.parent.columns.length), (e, i0) => {
                const newNode = {
                    type: 'td',
                    options: {
                        colspan: 1,
                        rowspan: 1,
                        isMerged: false
                    },
                    list: [],
                    style: {}
                }
                if (index !== 0) {
                    const {
                        status,
                        x,
                        y,
                        ranges
                    } = arr[i0]
                    //@ts-ignore
                    if (/[1, 2]/.test(status)) {
                        newNode.options.isMerged = true
                        for (let i0 = 0; i0 < ranges.length; i0++) {
                            for (let i1 = 0; i1 < ranges[i0].length; i1++) {
                                if (i1 === 0) {
                                    ranges[i0].forEach(e => {
                                        e.options.rowspan = newNode.options.rowspan = ranges.length + 1
                                        newNode.options.colspan = e.options.colspan
                                    })
                                }
                            }
                        }
                    }
                }
                return newNode
            })
        })
        root.rows.splice(dir === 'before' ? index : index + 1, 0, tr)
        root.rows.forEach((item) => {
            //@ts-ignore
            addContext(item, root)
        })
    }
}
export const addContext = (node, parent?: any, fn?: any) => {
    // console.log(node)
    // if (isAddId) {
    //   node.id = nanoid()
    //   node.key = `${node.type}_${nanoid()}`
    // }
    let arr = []
    const isArray = Array.isArray(parent)
    if (isArray) {
        arr = parent
    } else {
        arr = parent.columns || parent.list || parent.rows
    }
    fn && fn(node)
    const context = {
        get props() {
            return (isPc) => computed(() => {
                const {
                    options
                } = node
                const result: any = {
                    disabled: options.disabled,
                    placeholder: options.placeholder,
                    clearable: options.clearable,
                    required: options.required
                }
                if (isPc) {
                    // result.style = {
                    //   width: options.width + options.widthType
                    // }
                } else {
                    //@ts-ignore
                    result.label = node.label
                }
                switch (node.type) {
                    case 'input':
                        if (options.isShowWordLimit) {
                            //@ts-ignore
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
                        result.type = 'textarea'
                        result.rows = options.rows
                        break
                    case 'number':
                        if (isPc) {
                            result.controls = options.controls
                            if (options.controls) {
                                result['controls-position'] = options.controlsPosition ? 'right' : ''
                            }
                        }
                        if (options.isShowWordLimit) {
                            result.min = options.min
                            result.max = options.max
                        }
                        result.step = options.step
                        result.precision = options.precision
                        break
                    case 'radio':
                    case 'checkbox':
                        break
                    case 'select':
                        break
                    case 'time':
                        result.format = options.format
                        if (isPc) {
                            result.valueFormat = options.valueFormat
                        }
                        break
                    case 'date':
                        result.placeholder = options.placeholder
                        result.startPlaceholder = options.startPlaceholder
                        result.endPlaceholder = options.endPlaceholder
                        result.format = options.format
                        result.type = options.type
                        if (isPc) {
                            result.disabledDate = (time) => {
                                const {
                                    startTime,
                                    endTime,
                                    weeks,
                                    isShowWeeksLimit
                                } = options
                                const startDate = dayjs.unix(startTime)
                                const endDate = dayjs.unix(endTime)
                                const currentDate = dayjs(time)
                                const result = currentDate.isBefore(startDate) || currentDate.isAfter(endDate)
                                return result
                            }
                        } else {
                            const {
                                startTime,
                                endTime,
                                weeks,
                                isShowWeeksLimit
                            } = options
                            switch (options.type) {
                                case 'date':
                                case 'datetime':
                                    if (startTime) {
                                        result.minDate = dayjs.unix(startTime).toDate()
                                    } else {
                                        result.minDate = dayjs.unix(0).toDate()
                                    }
                                    if (endTime) {
                                        result.maxDate = dayjs.unix(endTime).toDate()
                                    } else {
                                        result.maxDate = dayjs().add(20, 'year').toDate()
                                    }
                                    break
                                case 'dates':
                                    if (options.defaultValue) {
                                        result.defaultDate = options.defaultValue.map(e => dayjs.unix(e).toDate())
                                    } else {
                                        result.defaultDate = null
                                    }
                                    if (startTime) {
                                        result.minDate = dayjs.unix(startTime).toDate()
                                    } else {
                                        result.minDate = dayjs().subtract(1, 'year').toDate()
                                    }
                                    if (endTime) {
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
                                    if (startTime) {
                                        result.minDate = dayjs.unix(startTime).toDate()
                                    } else {
                                        result.minDate = dayjs().subtract(1, 'year').toDate()
                                    }
                                    if (endTime) {
                                        result.maxDate = dayjs.unix(endTime).toDate()
                                    } else {
                                        result.maxDate = dayjs().add(1, 'year').toDate()
                                    }
                                    break
                            }
                        }
                        break
                    case 'cascader':
                        result.props = {
                            multiple: options.multiple,
                            checkStrictly: options.checkStrictly
                        }
                        result.options = options.options
                        break
                    case 'slider':
                        result.step = options.step
                        result.min = options.min
                        result.max = options.max
                        break
                    case 'divider':
                        result.contentPosition = options.contentPosition
                        break
                    case 'uploadfile':
                        result.multiple = options.multiple
                        result.action = options.action
                        result.limit = options.limit
                        result.size = options.size
                        result.accept = options.accept
                        break
                }
                return result
            })
        },
        get row() {
            let result: any = ''
            if (isArray || node.type === 'tr') {
                result = arr.indexOf(node)
            } else {
                result = parent.context.row
            }
            return result
        },
        get col() {
            let result: any = ''
            if (isArray) {
                result = 0
            } else {
                if (parent.type === 'grid' || parent.type === 'tr' || parent.type === 'td' || parent.type === 'col' || parent.type === 'tabsCol' || parent.type === 'collapseCol') {
                    result = arr.indexOf(node)
                } else {
                    result = parent.context.col
                }
            }
            return result
        },
        get root() {
            let result = {}
            switch (node.type) {
                case 'grid':
                case 'table':
                    result = node
                    break
                default:
                    result = parent.context.root
            }
            return result
        },
        state: node,
        parent,
        get parents() {
            const result = []
            let cursor = node
            while (cursor) {
                result.unshift(cursor)
                if (cursor.context.parent && !_.isArray(cursor.context.parent)) {
                    cursor = cursor.context.parent
                } else {
                    cursor = ''
                }
            }
            return result
        },
        copy() {
            const index = arr.indexOf(node)
            const newNode = reactive(_.cloneDeep(toRaw(node)))
            delete newNode.context
            newNode.id = nanoid()
            newNode.key = `${newNode.type}_${newNode.id}`
            addContext(newNode, parent, (node) => {
                node.id = nanoid()
                node.key = `${node.type}_${node.id}-copy`
            })
            arr.splice(index + 1, 0, newNode)
        },
        delete() {
            if (checkIsInSubform(node) && node.type === 'inline') {
                arr[0].splice(arr[0].indexOf(node), 1)
            } else {
                arr.splice(arr.indexOf(node), 1)
            }
        },
        appendCol() {
            //@ts-ignore
            const newNode = wrapElement({
                options: {
                    span: 6,
                    offset: 0,
                    pull: 0,
                    push: 0
                },
                type: 'col',
                list: [
                ]
            })
            node.columns.push(newNode)
            addContext(newNode, node)
        },
        get columns() {
            const result = []
            switch (node.type) {
                case 'table':
                    node.rows.forEach((item0, index0) => {
                        item0.columns.forEach((item1, index1) => {
                            if (!index0) {
                                result.push([])
                            }
                            result[index1].push(item1)
                        })
                    })
                    break
                default:
            }
            return result
        },
        get isDisableMargeLeft() {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const nodes = root.rows[row].columns
            let result = col <= 0
            if (!result) {
                let onOff = true
                findNode(node, 'before', 'colspan', (nodes) => {
                    onOff = result = !nodes.every(e => e.options.rowspan === node.options.rowspan) || nodes.every(e => e.options.isMerged)
                })
                result = onOff
            }
            return result
        },
        get isDisableMargeRight() {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const nodes = root.rows[row].columns
            let result = col >= nodes.length - 1
            if (!result) {
                let onOff = true
                findNode(node, 'after', 'colspan', (nodes) => {
                    onOff = result = !nodes.every(e => e.options.rowspan === node.options.rowspan) || nodes.every(e => e.options.isMerged)
                })
                result = onOff
            }
            return result
        },
        get isDisableMargeRow() {
            const nodes = getNodes(node, 'colspan')
            return this.isDisableDelRow || nodes.length === node.options.colspan
        },
        get isDisableMargeColumn() {
            const nodes = getNodes(node, 'rowspan')
            return this.isDisableDelColumn || nodes.length === node.options.rowspan
        },
        get isDisableMargeBottom() {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const columns = root.context.columns
            let result = row >= columns[col].length - 1
            if (!result) {
                let onOff = true
                findNode(node, 'after', 'rowspan', (nodes) => {
                    onOff = result = !nodes.every(e => e.options.colspan === node.options.colspan) || nodes.every(e => e.options.isMerged)
                })
                result = onOff
            }
            return result
        },
        get isDisableMargeTop() {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const columns = root.context.columns
            let result = row <= 0
            if (!result) {
                let onOff = true
                findNode(node, 'before', 'rowspan', (nodes) => {
                    onOff = result = !nodes.every(e => e.options.colspan === node.options.colspan) || nodes.every(e => e.options.isMerged)
                })
                result = onOff
            }
            return result
        },
        get isDisableSplitColumn() {
            return node.options.colspan === 1
        },
        get isDisableSplitRow() {
            return node.options.rowspan === 1
        },
        get isDisableDelRow() {
            const nodes = getNodes(node, 'colspan')
            const rowspanNodes = getNodes(node, 'rowspan')
            return (rowspanNodes.length === 1 || rowspanNodes.filter(e => !e.options.isMerged).length === 1) || !nodes.every(e => e.options.rowspan === node.options.rowspan)
        },
        get isDisableDelColumn() {
            const nodes = getNodes(node, 'rowspan')
            const colspanNodes = getNodes(node, 'colspan')
            return (colspanNodes.length === 1 || colspanNodes.filter(e => !e.options.isMerged).length === 1) || !nodes.every(e => e.options.colspan === node.options.colspan)
        },
        merge(type) {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            switch (type) {
                case 'left':
                    findNode(node, 'before', 'colspan', (nodes, callBack) => {
                        callBack()
                    })
                    break
                case 'right':
                    findNode(node, 'after', 'colspan', (nodes, callBack) => {
                        callBack()
                    })
                    break
                case 'top':
                    findNode(node, 'before', 'rowspan', (nodes, callBack) => {
                        callBack()
                    })
                    break
                case 'bottom':
                    findNode(node, 'after', 'rowspan', (nodes, callBack) => {
                        callBack()
                    })
                    break
                case 'row':
                    while (root.rows[row].columns.length > root.rows[row].columns[0].options.colspan) {
                        findNode(root.rows[row].columns[0], 'after', 'colspan', (nodes, callBack) => {
                            callBack()
                        })
                    }
                    break
                case 'column':
                    while (root.context.columns[col].length > root.context.columns[col][0].options.rowspan) {
                        findNode(root.context.columns[col][0], 'after', 'rowspan', (nodes, callBack) => {
                            callBack()
                        })
                    }
                    break
                default:
            }
        },
        insert(type) {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            switch (type) {
                case 'left':
                    appendNodes(node, 'before', 'colspan')
                    // root.rows.forEach(e => {
                    //   addContext(e, root, false)
                    // })
                    break
                case 'right':
                    appendNodes(node, 'after', 'colspan')
                    break
                case 'top':
                    appendNodes(node, 'before', 'rowspan')
                    break
                case 'bottom':
                    appendNodes(node, 'after', 'rowspan')
                    break
            }
        },
        split(type) {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const nodes = getNodes(node, type === 'column' ? 'colspan' : 'rowspan')
            switch (type) {
                case 'column':
                    //  zheliyoudu  没有考虑底层
                    nodes.slice(col, col + node.options.colspan).forEach(e => {
                        e.options.colspan = 1
                        e.options.isMerged = false
                        if (e.options.rowspan > 1) {
                            const nodes = getNodes(e, 'rowspan')
                            nodes.slice(row + 1, row + e.options.rowspan).forEach((e) => {
                                e.options.colspan = 1
                            })
                        }
                    })
                    break
                case 'row':
                    nodes.slice(row, row + node.options.rowspan).forEach(e => {
                        e.options.rowspan = 1
                        e.options.isMerged = false
                        if (e.options.colspan > 1) {
                            const nodes = getNodes(e, 'colspan')
                            nodes.slice(col + 1, col + e.options.colspan).forEach((e) => {
                                e.options.rowspan = 1
                            })
                        }
                    })
                    break
            }
        },
        del(type) {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const nodes = getNodes(node, type === 'column' ? 'colspan' : 'rowspan')
            // let result = false
            switch (type) {
                case 'column':
                    root.rows.forEach(e => {
                        e.columns.splice(col, node.options.colspan)
                        addContext(e, root)
                    })
                    break
                case 'row':
                    root.rows.splice(row, node.options.rowspan)
                    root.rows.forEach(e => {
                        addContext(e, root)
                    })
                    break
            }
        }
    }
    Object.defineProperty(node, 'context', {
        value: context,
        writable: false,
        enumerable: false,
        configurable: true
    })
    let nodes = []
    if (node.type === 'subform') {
        nodes = node.list[0]
    } else {
        nodes = node.columns || node.list || node.rows || []
    }
    nodes.forEach(e => {
        addContext(e, node, fn)
    })
}
export {
    syncWidthByPlatform,
    wrapElement,
    deepTraversal,
    renderFieldData,
    getAllFields,
    disassemblyData1,
    combinationData1,
    disassemblyData2,
    combinationData2,
    checkIslineChildren,
    checkIsField,
    pickfields,
    fieldLabel,
    transferData,
    transferLabelPath,
    isNull,
    repairLayout,
    checkIsInSubform,
    getSubFormValues,
    findSubFormAllFields,
    processField,
}