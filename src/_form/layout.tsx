import { defineComponent, inject, resolveComponent, unref, useAttrs, useSlots } from 'vue';
import { Base, hookIns } from './base';
import DragGable from 'vuedraggable';
import { isHTMLTag } from '@vue/shared';
import ControlInsertionPlugin from './controllPlugin';
const dragGableWrap = defineComponent({
  inheritAttrs: false,
  name: 'customDragGable',
  customOptions: {},
  components: {
    DragGable,
  },
  setup(props) {
    const { isEditModel } = hookIns.useTarget();
    return () => {
      const attrs: any = useAttrs();
      let node = '';
      if (unref(isEditModel)) {
        node = <dragGable {...attrs}>{useSlots()}</dragGable>;
      } else {
        const tag = isHTMLTag(attrs.tag) ? attrs.tag : resolveComponent(attrs.tag);
        const { item } = useSlots();
        node = (
          <tag {...attrs.componentData}>
            {attrs.list.map((e) => {
              return item({
                element: e,
              });
            })}
          </tag>
        );
      }
      return node;
    };
  },
});
export class Layout extends Base {
  dragOptions = {
    swapThreshold: 1,
    group: {
      name: 'er-Canves',
    },
    parent: null,
    plugins: [],
    ControlInsertion: true,
  };
  constructor(config: any) {
    super(config);
    this.dragOptions.parent = config.parent;
    let editor = inject('editor');
    this.dragOptions.plugins = [ControlInsertionPlugin(editor)];
  }
  setup() {
    super.setup();
    this.useHook('namespace', 'DragGableLayout');
    this.useHook('target');
  }
  handleMove() {
    return true;
  }
  render() {
    let props = this.props;
    let ns = this.hookCache['namespace'];
    const { state, isEditModel, isPc, setSelection } = this.hookCache['target'];
    let dragOptions = this.dragOptions;
    let slots = useSlots();
    return (
      <dragGableWrap
        list={props.data}
        handle='.ER-handle'
        class={[ns.b(), unref(isEditModel) && ns.e('edit')]}
        tag={props.tag}
        item-key='id'
        move={this.handleMove}
        {...dragOptions}
        v-slots={slots}
        componentData={useAttrs()}
      ></dragGableWrap>
    );
  }
}

export class TableLayout extends Layout {
  constructor(config: any) {
    super(config);
  }
}

export class GridLayout extends Layout {
  constructor(config: any) {
    super(config); //
  }
}
