import { defineComponent } from "vue";
import erForm from '@ER/formCom'
import erFormEditor from '@ER/formEditor/formEditor';
import { formConfig } from "@ER/formEditor/testData"
export default defineComponent({
    components: {
        erForm,
        erFormEditor
    },
    setup() {
        let _config = JSON.parse(JSON.stringify(formConfig))
        return () => {
            // return <erFormEditor></erFormEditor>
            return <erForm formConfig={formConfig}></erForm>
        }
    }
})