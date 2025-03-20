import { defineComponent, onMounted, provide } from 'vue';
import { ListTable } from '@visactor/vtable';
import { Table } from './table';
//核心表格组件
export default defineComponent({
  name: 'TableEditor',
  setup(props, { slots, attrs, emit }) {
    const tableIns = new Table(props);
    provide('tableIns', tableIns); //
    onMounted(() => {
      tableIns.onMounted(); //
    });
    const registerRootDiv = (el) => {
      if (el) {
        tableIns.registerRef('rootDiv', el);
      } else {
        tableIns.unregisterRef('rootDiv');
      }
    }; //
    onMounted(() => {
      console.log(tableIns, 'tsetIns');
    });
    return () => <div ref={registerRootDiv}>tableEditor</div>;
  },
});
