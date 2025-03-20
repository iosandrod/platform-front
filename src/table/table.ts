import { Base } from "@ER/base";
import { computed } from "vue";
export class Column {
    constructor(config: any) { }//
    getFormitem() {
        return computed(() => {
            let obj = {}
            return obj
        })
    }
}
export class Table extends Base {
    columns: any[]
    constructor(config) {
        super()
    }
    getTableName() {

    }
    setColumns() {

    }
    addColumn(config) {
        let col = new Column(config)
        this.columns.push(col)
    }
    getForm() {

    }
}