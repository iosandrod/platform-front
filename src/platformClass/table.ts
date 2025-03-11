import { Base } from "./base";
import { FeathersService, Service } from '@feathersjs/feathers'
import { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable'
import { ListTableProtected } from "@visactor/vtable/es/ts-types/base-table";
import { ListTable } from '@visactor/vtable'
import { shallowRef, watchEffect } from "vue";
export type findConfig = {}//
export class Column {

}
export class Table extends Base {
    isRender?: boolean = false
    instance: ListTable
    tableConfig: ListTableConstructorOptions = {}
    //服务类
    service: FeathersService//
    serviceName: string
    watchEffectArr: any[] = []
    constructor(config: ListTableConstructorOptions, service: any) {
        super(config)//
        this.tableConfig = config
        this.service = service//
    }//
    useWatchEffect() {
        let colWatchEffect = watchEffect(() => {
            let tableConfig = this.tableConfig
            let columns = tableConfig.columns
            let _cols = columns.map(col => {
                return col
            })
            let instance = this.instance
            instance.updateColumns(_cols)//
        })
        this.watchEffectArr.push(colWatchEffect)
        let recordsWatchEffect = watchEffect(() => {
            let tableConfig = this.tableConfig
            let records = tableConfig.records
            let instance = this.instance
            instance.setRecords(records)//
        })
        this.watchEffectArr.push(recordsWatchEffect)//
    }
    useServiceEffect() {
        let service = this.service
        //@ts-ignore
        service.on('created', (data) => {
            console.log('我创建了')//
        })
    }
    //取消挂载
    unRender() {
        let instance = this.instance
        this.watchEffectArr.forEach(item => {
            item()//
        })
        instance.release()//
        this.isRender = false
        this.instance = null
    }
    getConfig() {

    }
    render(el: HTMLElement) {
        if (this.isRender == true) {
            return//
        }
        const instance = this.instance
        if (el == null) {
            return
        }
        //@ts-ignore
        this.instance = shallowRef(new ListTable({
            container: el,
        }))//
        this.useWatchEffect()//
        this.useServiceEffect()//
        this.find()
        this.isRender = true
    }
    async find(query?: findConfig) {

    }
    async create() { }
    async remove() { }
    async patch() { }
    async update() { }
}   