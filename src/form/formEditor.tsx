import FormCom from './_formEditor';
import {} from 'vxe-table';
import { uniqueId } from 'xe-utils';
import { nextTick, provide, unref, withDirectives } from 'vue';
import { Base } from './base';
import { ElMain } from 'element-plus';
import { dectiveEl } from './dective';

export class FormEditor extends Base {
  namespace: string = '';
  hookCache: any = {};
  isFoldFields: Boolean = true;
  isFoldConfig: Boolean = true;
  isShow: Boolean = true;
  isShowConfig: Boolean = true;
  lang = 'zh-cn';
  //公共配置
  props: any = {};
  t: any;
  //使用静态变量
  state: any = {
    store: [],
    selected: {}, //当前选择的节点
    mode: 'edit',
    platform: 'pc',
    children: [],
    config: {},
    previewVisible: false,
    widthScaleLock: false,
    data: {},
    validateStates: [],
    fields: [],
    Namespace: 'formEditor', //@ts-ignore
    logic: {},
    othersFiles: {},
  };
  selection: any = {};
  static component = FormCom;
  elementPool: { [key: string]: HTMLDivElement } = {};
  elementMap: { [key: string]: string } = {};
  constructor(props: any) {
    super(props);
  }
  //使用instance的语法
  useInstance() {}
  registerElement(name: string) {}
  registerRef(name: string) {}
  registerProvide(name: string, value) {}
  useComputed() {}
  setup() {
    super.setup();
    provide('editor', this); //
    provide('Everright', this);
    this.useHook('namespace', 'Canves');
    this.useHook('target'); //
  }
  render() {
    let hookCache = this.hookCache;
    let ns = hookCache.namespace;
    let { isPc, isEditModel } = hookCache.target;
    let scrollCom = withDirectives(
      <el-scrollbar>
        {' '}
        <div>{123123}</div>
      </el-scrollbar>,
      [[dectiveEl(this, 'canvesScrollRef')]]
    );
    return withDirectives(
      <div>
        <ElMain
          class={[
            ns.b(),
            isEditModel.value && ns.e('editModel'),
            !unref(isPc) && ns.e('mobile'),
            !unref(isPc) && ns.e(`mobile_layoutType${1}`),
          ]}
        >
          <div class={[ns.e('container')]}>{scrollCom}</div>
        </ElMain>
      </div>,
      []
    );
  } //
  onMounted() {}
  onUnmounted() {}
  useHook(name: string, ...args) {
    let hookIns = this.hookIns;
    let useMethod = `use${name[0].toUpperCase() + name.slice(1)}`;
    let method = hookIns[useMethod];
    if (typeof method !== 'function') {
      return;
    }
    let value = method.call(hookIns, ...args);
    let hookCache = this.hookCache;
    hookCache[name] = value; //
  }
  setSelection(node) {
    let state = this.state;
    let result = '';
    if (node === 'root') {
      result = state.config;
    } else {
      if (node.type === 'inline') {
        result = node.columns[0];
      } else {
        result = node;
      }
    }
    let status = state.selected === result;
    this.isShowConfig = status; //
    state.selected = result;
    nextTick(() => {
      this.isShowConfig = true;
    });
  }
}

export const createForm = (props: any) => {};
