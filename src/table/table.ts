import { Base } from "@ER/base";
import { ListTable } from '@visactor/vtable'
import { EventEmitter } from "stream";
export class Column {
    constructor() { }//
}
export class Table extends Base {
    event: EventEmitter
    instance
    columns: any[]
    constructor(config) {
        super()//
    }
    getTableName() {

    }
    setColumns() {

    }
    addColumn() {

    }
    getColumns() {

    }
    onMounted(): void {

    }
    mount(div: HTMLDivElement) {

    }
    insertRows(insertConfig) {

    }
    async refreshData() {
        return new Promise(async (resolve, reject) => {
            resolve(null)
        })
    }
}