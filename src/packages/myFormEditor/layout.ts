import { defineComponent, useSlots } from 'vue'
import { Node } from './editor'
const excludes = ['grid', 'col', 'table', 'tr', 'td', 'tabs', 'tabsCol', 'collapse', 'collapseCol', 'divider', 'inline']
export class Layout extends Node {
  columns: Layout[] = []
  constructor(config) {
    super(config)
  }
}

export class TabLayout extends Layout {
  constructor(config) {
    super(config)
  }
}

export class TabColLayout extends Layout {

}


export class InlineLayout extends Layout {

}

export const layoutComponent = defineComponent({
  props: {
    node: {
      type: Layout
    }
  },
  setup(props, attrs) {
    const node = props.node//
    return () => {
      const slots = useSlots()
    }
  }
})
