import { defineComponent, onMounted, onUnmounted, defineExpose } from 'vue';
let _component = defineComponent({
  props: {
    _constructor: {} as any,
    config: {},
  },
  setup(props, { attrs, slots, emit }) {
    const _constructor = props._constructor;
    const instance = new _constructor(props?.config || props); //
    instance.setup(); //
    onMounted(() => {});
    onUnmounted(() => {});
    defineExpose({
      instance: instance,
    }); //
    return () => {
      let renderCom = instance.render();
      return renderCom; //
    };
  },
});
export default _component;
export const baseComponent = _component;
