import { defineComponent } from "vue";
import { Editor, Field, Node } from './editor'//
import { } from 'vuedraggable'
export const mainComponent = defineComponent({
  setup(props, attrs) {
    return () => {
      const editor = new Editor({})
    }
  }
})
export const fieldComponent = defineComponent({
  setup(props, attrs) { }
})


export const selectComponent = defineComponent({
  props: {
    node: {
      type: Node
    }
  },
  setup(props, attrs) {
    const node = props.node//is layout or field
    //假设都是layout
    return () => {

    }
  }
})
