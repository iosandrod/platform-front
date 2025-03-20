import { defineComponent } from 'vue';
import erForm from '@ER/formCom';
import erFormEditor from '@ER/formEditor/formEditor';
import tableEditor from '@/table/tableEditor';
import { formConfig } from '@ER/formEditor/testData';
import pageDesign from '@DESIGN/formEditor/pageDesign';//
export default defineComponent({
  components: {
    erForm,
    erFormEditor,
    tableEditor,
    pageDesign
  },
  setup() {
    // let _config = JSON.parse(JSON.stringify(formConfig))
    return () => {
      // return <pageDesign></pageDesign>
      // let com = <erFormEditor></erFormEditor>;
      // return com;
      // return <tableEditor></tableEditor>;
      return <erFormEditor></erFormEditor>;
      // return <erForm formConfig={formConfig}></erForm>;
    };
  }, 
});
