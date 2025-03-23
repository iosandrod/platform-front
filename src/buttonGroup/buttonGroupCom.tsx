import { itemGroup } from "@/buttonGroup/buttonGroup";
import { defineComponent } from "vue";
import tabCom from "@/buttonGroup/tabCom";
import { ElButton } from "element-plus";
export default defineComponent({
    name: "buttonGroupCom",
    components: {
        tabCom
    },
    props: {
        items: {

        },
        _class: {
            type: Function
        }
    },
    setup(props, { attrs, slots, emit }) {
        let group = new itemGroup(props, props._class as any);
        const ns = group.hooks.useNamespace('buttonGroupCom')
        return () => {
            let com = <div>
                <tabCom {...props} height={25} v-slots={{
                    item: (el) => {
                        return <ElButton class={ns.b()}>button{el.id}</ElButton>
                    }
                }}></tabCom>
            </div>
            return com
        };
    },
});