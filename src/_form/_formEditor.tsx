import { defineComponent, onMounted, onUnmounted, defineExpose } from 'vue';
export default defineComponent({
  props: {
    _constructor: {} as any,
  },
  setup(props, { attrs, slots, emit }) {
    const _constructor = props._constructor;
    const instance = new _constructor(props);
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
