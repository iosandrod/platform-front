import { defineComponent, reactive } from "vue";
import formEditor from '@ER/formEditor/formEditor'
import { FormLayout } from "./type";
import { staticData, formConfig } from "./formEditor/testData";
import { nanoid } from 'nanoid'
import { FormItem } from "./formitem";
import { Field, Layout, Table, TableRow } from "./layoutType";
import { Base } from "./base";
//转换数据


export class Form extends Base {
    parent?: Form
    data: any
    formData: any
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
    mobileLayout: any[] = []
    constructor(config) {
        super()
        this.init()
        let items = config.items || []
        this.data = config.data || {}//
        this.setFields(items)//
    }
    setFields(items) {
        this.items.splice(0)
        for (const item of items) {
            this.addFormItem(item)//
        }
    }
    async validate() {
        return new Promise(async (resolve, reject) => {
            let form = this.getRef('form')
            let res = await form.validate()
            console.log(res, 'testRes')// 
                ;
        })
    }
    getValidateRules() {
        let items = this.items
        let itemsRules = items.map(item => {
            let rule = item.getValidateRoles()
            return rule
        })
        return itemsRules
    }
    init() {
        this.initPcLayout()
        this.initMobileLayout()
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
        let mobileLayout = this.mobileLayout
        //清零
        mobileLayout.splice(0)
        let items = this.items
        for (const item of items) {
            let _mobileLayout = item.mobileColumns
            mobileLayout.push(..._mobileLayout)
        }
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
    }
    delFormItem(id) {
        let index = this.items.findIndex(item => item.id === id)
        if ((index !== -1)) {
            this.items.splice(index, 1)
        }
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
        let form = this.getRef('form')
        if (!form) {
            return //
        }
        let formData = data || this.getFormConfig()//
        form.setData(formData)//
    }
}
//使用默认布局

export const createLayoutData = (data): FormLayout => {
    return {} as any
}
