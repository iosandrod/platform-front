import { ElInput } from "element-plus"
import { defineComponent } from "vue"

export default defineComponent({
  name: 'InputPc',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: Object,
    params: Object
  },
  components: {
    ElInput
  },
  setup(props) {
    const data = props.data
    const params = props.params
    let formitem = params.formitem//
    // console.log(formitem, 'testFormItem')//
    return () => {
      return <ElInput {...params} v-model={data.options.defaultValue} ></ElInput>
    }
  }
})