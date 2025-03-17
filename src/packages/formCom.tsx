import { defineComponent, onMounted, onUnmounted, ref, withDirectives } from "vue";
import preview from '@ER/formEditor/preview'
import { Form } from "./form";
export default defineComponent({
    components: {
        preview,
    },
    props: {
        formConfig: {
            type: Object
        }
    },
    setup(props, { slots }) {
        let fIns = new Form(props.formConfig)
        const editor = ref(null)
        const registerForm = (el) => {
            if (el == null) {
                fIns.unregisterRef('form')
            } else {
                fIns.registerRef('form', el) 
            }
        }//
        onMounted(() => {
            fIns.onMounted()//
        })
        onUnmounted(() => {
            fIns.onUnmounted()//
        })
        return () => {
            let com = withDirectives(<preview isShowCompleteButton={false} ref={registerForm} formIns={fIns}></preview>, [[{
                mounted(el) {

                }
            }]])
            return com
        }
    }
})