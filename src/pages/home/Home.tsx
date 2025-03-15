import { defineComponent } from "vue";
import erForm from '@ER/form'
import erFormEditor from '@ER/formEditor/formEditor';
export default defineComponent({
    components: {
        erForm,
        erFormEditor
    },
    setup() {
        return () => {
            return <erFormEditor></erFormEditor>
        //    return  <erForm></erForm>
        }
    }
})