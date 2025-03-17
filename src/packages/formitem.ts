import { Base } from "./base"
import { Form, } from "./form"
import { Field, TableCell, TableRow } from "./layoutType"
export type FormOptions = {
    items: Field[]
}


export class FormItem extends Base {
    field: Field = {} as any
    subForm?: Form
    form: Form
    config: Field//
    rowIndex: number// 
    columns: TableCell[] = []
    mobileColumns: TableCell[] = []
    constructor(config: Field, form) {
        super()
        this.form = form
        this.config = config
        this.init()//初始化行列
    }
    getSpan() {
        let options = this.config
        let span = options.span
        if (span == null) {
            span = 6
        }
        return span
    }
    init() {
        //处理列
        let tdRow = this.createTdRow()
        let tr = this.getTr()
        tr.columns.push(...tdRow)
        this.columns = tdRow
        //处理字段
        let field = this.createField()
        this.field = field
        let mobileRow = this.createMobileRow()
        this.mobileColumns = mobileRow
        this.form.mobileLayout.push(...mobileRow)//
    }//
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
    createTdRow(): TableCell[] {
        let span = this.getSpan()
        let tDList = Array(span).fill(null).map((row, i) => {
            let isMerge = i > 0 ? true : false
            let id = this.uuid()
            let key = `td_${id}`
            let list = []
            if (i == 0) {
                let iId = this.uuid()
                let iKey = `inline_${iId}`
                let fId = this.id
                let obj = {
                    type: 'inline',
                    columns: [fId],
                    style: {},
                    id: iId,
                    key: iKey
                }
                list.push(obj)
            }//
            let obj1: TableCell = {
                type: 'td',
                style: {},
                options: {
                    colspan: span,
                    rowspan: 1,
                    isMerged: isMerge
                },
                id,
                key,
                list: list//
            }
            return obj1
        })
        return tDList//
    }
    createField() {
        let type = this.getType()
        let id = this.id
        let key = `${type}_${id}`//
        let config = this.config
        let field = { ...this.config, id: id, key: key, field: config.field }
        return field
    }
    createMobileRow() {
        let obj = [{
            type: 'inline',
            columns: [this.id],
        }] as any
        return obj
    }
    getTr() {
        let form = this.form
        let items = form.items
        let curIndex = items.findIndex((item) => item === this)
        if (curIndex === -1) {
            curIndex = items.length//
        }
        let preItems = items.slice(0, curIndex)
        let preSpans = preItems.map((item) => item.getSpan())
        let preSpan = preSpans.reduce((a, b) => a + b, 0)//
        let rowIndex = Math.ceil((preSpan + this.getSpan()) / 24)
        this.rowIndex = rowIndex
        let rows = form.getLayoutRows()//
        let length = rows.length
        let tr: TableRow = null
        if (length < rowIndex) {
            tr = this.createTrRow()
            form.addTrRow(tr)
        } else {
            tr = rows.slice(-1).pop()
        }
        return tr
    }
    getType() {
        let config = this.config
        let type = config.type
        if (type == null) {
            type = 'input'
        }
        return type
    }
}