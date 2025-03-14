import { defineComponent, inject, PropType, ref, unref } from "vue";
import hooks from '@ER/hooks'
import { ElButton } from "element-plus";
import { Button as VanButton } from "vant";
export default defineComponent({
    name: 'CompleteButton',
    props: {
        handle: Object as PropType<{ validate: () => Promise<void> }>,
        mode: {
            type: String as PropType<'edit' | 'preview'>,
            default: 'edit',
        },
    },
    setup(props) {
        const ER: any = inject('Everright')
        const ns = hooks.useNamespace('CompleteButton')
        const {
            state,
            isPc
        } = hooks.useTarget() 
        const element = ref('')
        const handleClick = async () => {
            if (props.mode === 'preview') return false
            try {
                await Promise.resolve(unref(props.handle).validate())
                // await ER.checkFieldsValidation()
                ER.fireEvent('submit', ER.getData())
            } catch (e) {
                console.log(e)
            }
        }
        return () => (
            <div >
                {isPc.value ? (
                    <div style={{ textAlign: 'center' }}>
                        <ElButton
                            onClick={handleClick}
                            type="primary"
                            style={{ backgroundColor: state.value.config[state.value.platform].completeButton.backgroundColor }}
                        >
                            <span style={{ color: state.value.config[state.value.platform].completeButton.color }}>
                                {state.value.config[state.value.platform].completeButton.text}
                            </span>
                        </ElButton>
                    </div>
                ) : (
                    <VanButton
                        onClick={handleClick}
                        round
                        block
                        type="primary"
                        style={{ backgroundColor: state.value.config[state.value.platform].completeButton.backgroundColor }}
                    >
                        <span style={{ color: state.value.config[state.value.platform].completeButton.color }}>
                            {state.value.config[state.value.platform].completeButton.text}
                        </span>
                    </VanButton>
                )}
            </div>
        )
    }
})