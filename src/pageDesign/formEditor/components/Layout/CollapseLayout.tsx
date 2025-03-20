import { defineComponent, resolveComponent, watch, useAttrs, defineAsyncComponent, inject } from 'vue'
import Selection from '@DESIGN/formEditor/components/Selection/selectElement'
import LayoutDragGable from './DragGable'
import hooks from '@DESIGN/hooks'
import { FormEditorContext } from '@DESIGN/type'
export default defineComponent({ 
  name: 'CollapseLayout',
  inheritAttrs: false,
  customOptions: {},
  props: { 
    data: Object,
    parent: Array
  },
  setup (props) {
    const ER:FormEditorContext = inject('Everright')
    const ns = hooks.useNamespace('CollapseLayout')
    if (!props.data.options.defaultValue.length) {
      props.data.options.defaultValue.push(props.data.columns[0].id)
    }
    return () => {
      return (
        <Selection {...useAttrs()} hasCopy hasDel hasDrag hasWidthScale data={props.data} parent={props.parent}>
          <el-collapse vModel={props.data.options.defaultValue} accordion={props.data.options.accordion}>
            {
              props.data.columns.map((element, index0) => {
                return (
                  <el-collapse-item title={element.label} name={element.id}>
                    <Selection
                      class={[ER.state.mode === 'edit' ? ns.e('area') : '']}
                      data={element} parent={props.data}
                    >
                      <LayoutDragGable
                        data={element.list}
                        data-layout-type={'collapse-col'}
                        parent={element}/>
                    </Selection>
                  </el-collapse-item>
                )
              })
            }
          </el-collapse>
        </Selection>
      )
    }
  }
})
