import { defineComponent, onMounted } from "vue";
import { ListTable } from '@visactor/vtable'
import { Table } from './table'
//核心表格组件
export default defineComponent({
    name: "TableEditor",
    setup(props, { slots, attrs, emit }) {
        const tableIns = new Table(props)
        onMounted(() => {
            tableIns.onMounted()//
        })
        return () => <div>tableEditor</div>;
    },
});