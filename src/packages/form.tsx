import { defineComponent, reactive } from "vue";
import formEditor from '@ER/formEditor/formEditor'
import { FormLayout } from "./type";
class Base {
    constructor() {
        return reactive(this)//
    }//
}
class Form extends Base {
    parent?: Form
    constructor() {
        super()
    }
    createForm(config) {

    }
}
export type formOptions = {}
export const createLayoutData = (data): FormLayout => {
    return {} as any
}
export default defineComponent({
    setup(props) {
        const form = new Form();
        return () => {
            return <div></div>
        }
    }
})