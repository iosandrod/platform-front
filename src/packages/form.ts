import { defineComponent, reactive, shallowRef } from "vue";
import formEditor from '@ER/formEditor/formEditor'
import { FormLayout } from "./type";
import { staticData, formConfig } from "./formEditor/testData";
import { nanoid } from 'nanoid'
import { FormItem } from "./formitem";
import { Field, Layout, Table, TableRow } from "./layoutType";
import { Base } from "@/base/base";
import { FormInstance, FormRules } from "element-plus";
import hooks from '@ER/hooks'
import { fieldsConfig } from "./formEditor/componentsConfig";
//转换数据
//

export class Form extends Base {
    state: any = {}
    isDesign = false
    data: any = {}//
    config: any = {}
    curFormItem?: FormItem
    parent?: Form//
    formData: any
    nextForm?: Form
    nextFormMap: any = {}
    items: FormItem[] = []
    pcLayout: Layout = {
        type: 'inline',
        columns: [{
            type: "table",
            label: "表格布局",
            icon: "tableStokeP2",
            id: null,
            key: null,
            rows: [],
            style: {},
            options: {
                width: 100,
                widthType: "%"
            }
        }],
        style: {},
        id: null,
        key: null,
    }
    submitConfig = {
        "isSync": true,
        "pc": {
            "size": "default",
            "labelPosition": "left",
            "completeButton": {
                "text": "提交",
                "color": "",
                "backgroundColor": ""
            }
        },
        "mobile": {
            "labelPosition": "left",
            "completeButton": {
                "text": "提交",
                "color": "",
                "backgroundColor": ""
            }
        }
    }
    _pcLayout: any = null
    _mobileLayout: any = null
    mobileLayout: any[] = []
    constructor(config) {
        super()
        this.config = config
        this.init()
        let items = config.items || config.fields || []
        let _data = config.data
        if (_data) {
            this.setData(_data)//
        }
        this.setFields(items)//
    }
    setFields(items) {
        this.items.splice(0)//
        for (const item of items) {
            this.addFormItem(item)//
        }
    }
    setPcLayout(layout) {
        this._pcLayout = layout
    }
    setMobileLayout(layout) {
        this._mobileLayout = layout//
    }
    async clearValidate() {
        const form: FormInstance = this.getRef('form')
        form.clearValidate()
    }
    getSubForm(id: string) {
        if (typeof id == 'object') {
            //@ts-ignore
            id = id.id
        }
        let item = this.items.find((item) => {
            return item.id == id
        })
        let subForm = item.subForm
        return subForm
    }
    async validate() {
        return new Promise(async (resolve, reject) => {
            // let form = this.getRef('form')
            // form.validate().catch(err => {
            //     reject(err)
            // })
        }).catch(err => {
            console.log(err, '报错了')//
        })
    }
    getPluginName() {
        let id = this.id
        let plugin = `ControlInsertion_${id}`
        return plugin
    }
    getValidateRules() {
        let items = this.items
        let itemsRules = items.map(item => {
            let rule = item.getValidateRoles()
            return rule
        }).reduce((res: any, rule) => {
            let field = rule.field
            let rules = rule.rules
            res[field] = rules
            return res
        }, {})//
        return itemsRules//
    }
    setCurrentDesign(status: boolean = true) {
        this.isDesign = false
    }
    init() {
        super.init()
        this.initPcLayout()
        this.initMobileLayout()
        this.setData({
            email: 'sfsd',
            name: "sdfdsf"
        })
    }
    setState(state) {
        this.state = state
    }
    getFields() {
        let items = this.items
        let obj = items.reduce((res: any, item) => {
            let id = item.id
            let field = item.field
            res[id] = field
            return res
        }, {})
        return obj
    }
    getBarsValue() {
        let parent = this.parent
        let title = this.getCurrentTabName()
        let arr = [{ title: title, formId: this.id }]
        if (parent != null) {
            let _arr = parent.getBarsValue()
            arr.unshift(..._arr)
        }
        return arr
    }//
    getFormArr() {
        let parentArr = this.getParentFormArr()
        let nextForm = this.getNextFormArr()
        return [...parentArr, this, ...nextForm]//
    }
    getFieldsDesignConfig() {
        let _fieldConfig = JSON.parse(JSON.stringify(fieldsConfig))
        return _fieldConfig
    }
    getNextFormArr() {
        let arr = []
        let nextForm = this.nextForm
        if (nextForm) {
            arr.push(nextForm)
            arr.push(...nextForm.getNextFormArr())
        }
        return arr
    }
    getParentFormArr() {
        let arr = []
        let parent = this.parent
        if (parent) {
            arr.push(parent)
            arr.push(...parent.getParentFormArr())
        }
        return arr
    }//
    formTabClick(id: string) {
        let allForm = this.getFormArr()
        let _f = allForm.find((form) => {//
            return form.id == id
        })
        let nextForms = _f.getNextFormArr()
        nextForms.forEach((form) => {
            form.nextForm = null
        })//
        _f.nextForm = null//
    }
    closeCurSubForm() { }
    getCurrentTabName() {
        let curFormItem = this.curFormItem
        if (curFormItem == null) {
            return this.getTitle()
        }
        return curFormItem.getTitle()
    }
    getTitle() {
        //这是子表单
        let formItem = this.curFormItem
        let title = ''
        if (formItem != null) {
            title = formItem.getTitle()
        }
        title = title || '数据表单'
        return title////
    }
    getRootForm() {
        let parent = this.parent
        if (parent != null) {
            return parent.getRootForm()
        } else {
            return this
        }
    }
    getFormConfig() {
        let obj: any = {}
        obj.config = this.submitConfig
        obj.fields = this.getFields()
        let pcLayout = this.getPcLayout()
        let mobileLayout = this.getMobileLayout()
        obj.layout = {
            pc: [pcLayout],
            mobile: mobileLayout
        }//
        obj.data = this.data//
        return obj
    }
    createTrRow(): TableRow {
        let id = this.uuid()
        let key = `tr_${id}`
        let tr = {
            type: 'tr',
            columns: [],
            style: {},
            id,
            key
        }
        return tr
    }
    getPcLayout() {
        let items = this.items
        let rows = []
        let _pcLayout = this._pcLayout
        if (_pcLayout != null) {
            return _pcLayout//
        }
        for (const item of items) {
            let index = item.getRowIndex()
            // debugger//
            let _row = rows[index]
            if (_row == null) {
                let nRow = this.createTrRow()
                rows[index] = nRow
                _row = nRow
            }
            _row.columns.push(...item.columns)
        }
        let pcLayout = this.pcLayout
        pcLayout.columns[0].rows = rows
        return pcLayout
    }
    getMobileLayout() {
        let mobileLayout = []
        //清零
        let _mobileLayout = this._mobileLayout
        if (_mobileLayout != null) {
            return _mobileLayout//
        }//
        let items = this.items
        for (const item of items) {
            let _mobileLayout = item.mobileColumns
            mobileLayout.push(..._mobileLayout)
        }
        this.mobileLayout = mobileLayout
        return mobileLayout
    }
    initPcLayout() {
        let pcLayout = this.pcLayout
        let id1 = this.uuid()
        let id2 = this.uuid()
        pcLayout.id = id1
        pcLayout.key = `inline_${id1}`
        pcLayout.columns[0].id = id2
        pcLayout.columns[0].key = `table_${id2}`//
    }
    initMobileLayout() {

    }
    addFormItem(config: Field) {
        let _item = new FormItem(config, this)
        this.items.push(_item)//
        return _item
    }
    delFormItem(id) {
        let index = this.items.findIndex(item => item.id === id)
        if ((index !== -1)) {
            this.items.splice(index, 1)
        }
        let nextFormMap = this.nextFormMap
        delete nextFormMap[id]//
    }
    getLayoutRows() {
        let layout = this.pcLayout
        let tableIns = layout.columns[0] as Table
        let rows = tableIns.rows
        return rows
    }
    onMounted() {
        let fConfig = this.getFormConfig()//
        this.setData((fConfig))
    }
    onUnmounted() {
        super.onUnmounted()//
    }
    setData(data) {
        // let form = this.getRef('form')
        // if (!form) {
        //     return //
        // }
        // let formData = data || this.getFormConfig()//
        // form.setData(formData)//
        this.data = data
    }
}
//使用默认布局

export const createLayoutData = (data): FormLayout => {
    return {} as any
}
