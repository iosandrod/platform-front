import { defineComponent } from "vue";
import { erFormEditor } from "@ER/formEditor";
export default defineComponent({
  components: {
    erFormEditor,
  },
  setup(props) {
    const formConfig = {
      itemSpan: 24,
      items: [
        {
          field: "email",
          label: "邮箱",
          required: true
        }, {
          field: "password",
          label: "密码",
          required: true,
          password: true
        }
      ]
    }
    return () => <div>
      <div class="" style={{ width: '400px', margin: '0 auto' }}>
        <erFormEditor {...formConfig}></erFormEditor>
      </div>
    </div>;
  }
})