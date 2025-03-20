import { Base } from "@ER/base";

export class Table extends Base {
    constructor() {
        super()
    }
    getTableName() {
        console.log(this.id)//
    }
}