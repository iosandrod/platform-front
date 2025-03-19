import { ElInput } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputPc',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: Object,
    params: Object,
  },
  setup(props) {
    const data = props.data;
    const params = props.params;
    const formitem = params.formitem;
    return () => {
      return <ElInput></ElInput>;
    };
  },
});
