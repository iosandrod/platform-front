import { defineComponent } from "vue"

export default defineComponent({
  name: 'InputPc',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: Object,
    params: Object
  },
  setup(props) {
    const data = props.data
    const params = props.params
    console.log(data, params)//
    return () => {
      return <div>pc</div>
    }
  }
})