import { defineComponent } from 'vue';
import erForm from '@ER/formCom';
import erFormEditor from '@ER/formEditor/formEditor';
import tableEditor from '@/table/tableEditor';
import { formConfig } from '@ER/formEditor/testData';
export default defineComponent({
  components: {
    erForm,
    erFormEditor,
    tableEditor,
  },
  setup() {
    // let _config = JSON.parse(JSON.stringify(formConfig))
    return () => {
      // let com = <erFormEditor></erFormEditor>;
      // return com;
      // return <tableEditor></tableEditor>;
      return <erFormEditor></erFormEditor>;
      // return <erForm formConfig={formConfig}></erForm>;
    };
  },
});
