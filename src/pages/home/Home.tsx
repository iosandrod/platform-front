import { defineComponent } from "vue";
import erFormEditor from '@ER/formEditor/formEditor';
export default defineComponent({
    components: {
        erFormEditor
    },
    setup() {
        return () => {
            return <erFormEditor></erFormEditor>
        }
    }
})