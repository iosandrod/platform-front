import { defineComponent, reactive } from "vue";
import formEditor from '@ER/formEditor/formEditor'
import { FormLayout } from "./type";
import { staticData, formConfig } from "./formEditor/testData";
import { nanoid } from 'nanoid'
import { FormItem } from "./formitem";
import { Field, Layout, Table } from "./layoutType";
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
        let items = config.items
        this.data = config.data || {}//
        for (const item of items) {
            this.addFormItem(item)
        }
    }
   
    async validate() {
        return new Promise((resolve, reject) => {

        })
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
        obj.layout = {
            pc: [this.pcLayout],
            mobile: this.mobileLayout
        }
        obj.data = this.data
        return obj
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
    addTrRow(data) {
        if (!data) {
            return
        }
        let rows = this.getLayoutRows()
        rows.push(data)//
    }
    getLayoutRows() {
        let layout = this.pcLayout
        let tableIns = layout.columns[0] as Table
        let rows = tableIns.rows
        return rows
    }
    onMounted() {
        let fIns = this.getRef('form')
        console.log(fIns, 'testIds')//
    }
    onUnmounted() {
        // let allKeys = Object.keys(this._refPool)
        // for (const key of allKeys) {
        //     this.unregisterRef(key)
        // }  
    }
}
//使用默认布局

export const createLayoutData = (data): FormLayout => {
    return {} as any
}
