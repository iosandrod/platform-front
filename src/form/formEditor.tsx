import FormCom from './_formEditor';
import { } from 'vxe-table';
import { uniqueId } from 'xe-utils';
import { h, nextTick, provide, unref, withDirectives } from 'vue';
import { Base } from './base';
import { ElMain, ElScrollbar } from 'element-plus';
import { directiveEl } from './directive';
import * as utils from './utils'
import _ from 'lodash'
//@ts-ignore
import locale from './locale'
export class FormEditor extends Base {
  namespace: string = 'Canves';//
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
  useInstance() { }
  registerElement(name: string) { }
  registerRef(name: string) { }
  registerProvide(name: string, value) { }
  useComputed() { }
  setup() {
    super.setup();
    provide('editor', this); //
    provide('Everright', this);
    this.useHook('namespace', 'Canves');
    this.useHook('target'); //
  }
  render() {//指令
    let hookCache = this.hookCache;
    let ns = hookCache.namespace;
    let { isPc, isEditModel } = hookCache.target;
    let scrollCom = withDirectives(
      <el-scrollbar>
        {123}
      </el-scrollbar>,//
      [[directiveEl(this, 'canvesScrollRef', (a, b, c) => {
        let ins = c.ctx.exposed
        return ins
      })]]
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
      [[directiveEl(this, 'canvesRef')]]
    );
  } //
  onMounted() { }
  onUnmounted() { }
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
  delField(node) {
    let state = this.state
    const fieldIndex = _.findIndex(state.fields, {
      id: node.id,
    });
    if (fieldIndex !== -1) {
      if (utils.checkIdExistInLogic(node.id, state.logic)) {
        //显示一下提示框//
        // ElMessage({
        //   showClose: true,
        //   duration: 4000,
        //   message: t("er.logic.logicSuggests"),
        //   type: "warning",
        // });
        utils.removeLogicDataByid(node.id, state.logic);
      }
      state.fields.splice(fieldIndex, 1);
    }
  }
  addFieldData(node, isCopy = false) {
    let state = this.state
    let props = this.props
    if (/^(radio|cascader|checkbox|select)$/.test(node.type)) {
      if (isCopy) {
        state.data[node.id] = _.cloneDeep(state.data[node.options.dataKey]);
        node.options.dataKey = node.id;
      } else {
        if (!state.data[node.id]) {
          node.options.dataKey = node.id;
          state.data[node.id] = {
            type: node.type,
            list: utils.generateOptions(3).map((e, i) => {
              e.label += i + 1;
              return e;
            }),
          };
        }
      }
    }
    if (/^(uploadfile|signature|html)$/.test(node.type)) {
      node.options.action = props.fileUploadURI;
    }
  }
  generatorData(node, isWrap = true, lang = 'zh-cn', isCreateLabel = true, eachBack) {
    const newNode = isWrap
      ? {
        type: 'inline',
        columns: [
          node
        ]
      }
      : node
    const result = utils.wrapElement(newNode, eachBack && eachBack)
    if (isCreateLabel) {
      node.label = utils.transferData(lang, utils.transferLabelPath(node), locale)
      // if (/^(input|textarea|number|radio|checkbox|select|time|date|rate|switch|slider|html|cascader|uploadfile|signature|region)$/.test()) {}
      if (/^(select|cascader|region|date|time)$/.test(node.type)) {
        node.options.placeholder = utils.transferData(lang, 'er.validateMsg.placeholder2', locale)
      }
      if (/^(select|checkbox|radio)$/.test(node.type)) {
        node.options.otherPlaceholder = utils.transferData(lang, 'er.validateMsg.placeholder3', locale)
      }
      if (/^(input|textarea|html)$/.test(node.type)) {
        node.options.placeholder = utils.transferData(lang, 'er.validateMsg.placeholder1', locale)
      }
      // node.options.placeholder
    }
    return result
  }
  addField(node) {
    let state = this.state
    if (utils.checkIsField(node)) {
      const findIndex = _.findIndex(state.fields, {
        id: node.id,
      });
      if (findIndex === -1) {
        state.fields.push(node);
      } else {
        state.fields.splice(findIndex, 1, node);
      }
    }
  }
  wrapElement(el, isWrap = true, isSetSelection = true, sourceBlock = true, resetWidth = true) {
    let lang = this.lang
    let state = this.state
    const node = sourceBlock
      ? this.generatorData(el, isWrap, lang, sourceBlock, (node) => {
        this.addFieldData(node);
        this.addField(node);
      })
      : isWrap
        ? {
          type: "inline",
          columns: [el],
        }
        : el;
    if (!sourceBlock && resetWidth) {
      if (utils.checkIsField(el)) {
        if (state.platform === "pc") {
          el.style.width.pc = "100%";
        } else {
          el.style.width.mobile = "100%";
        }
      } else {
        el.style.width = "100%";
      }
    }
    if (isSetSelection) {
      // nextTick(() => {
      //   setSelection(node)
      // })
    }
    return node;
  }
  setData(data: any) {
    let state = this.state
    if (_.isEmpty(data)) return false;
    const newData = utils.combinationData1(_.cloneDeep(data));
    this.isShow = false;
    state.store = newData.list;
    state.config = newData.config;
    state.data = newData.data;
    state.fields = newData.fields;
    state.logic = newData.logic;
    this.setSelection(state.config);
    state.store.forEach((e) => {
      utils.addContext(e, state.store);
    });
    nextTick(() => {
      this.isShow = true;
    });
  }
  setSelection(node) {
    let state = this.state
    let result = "";
    if (node === "root") {
      result = state.config;
    } else {
      if (node.type === "inline") {
        result = node.columns[0];
      } else {
        result = node;
      }
    }
    this.isShowConfig = state.selected === result;
    state.selected = result;
    nextTick(() => {
      this.isShowConfig = true;
    });
  }
  getData(config?: any) {
    let state = this.state
    if (!state.validateStates?.every((e) => !e.isWarning)) return {}
    let data = utils.combinationData2(state.store, state.data, state.logic, state.fields, config)//
    return data 
  }
  validateState(target, fn) {
    let state = this.state
    if (target) {
      const count = _.countBy(state.validateStates, "data.key");
      const newValue = target.key.trim();
      if (utils.isNull(newValue)) {
        _.find(state.validateStates, {
          data: { key: target.key },
        }).isWarning = true;
        fn && fn(0);
        return false;
      }
      state.validateStates.forEach((e) => {
        if (count[e.data.key] > 1) {
          e.isWarning = true;
        } else {
          e.isWarning = false;
        }
      });
      if (fn) {
        fn(!(count[newValue] > 1) ? 1 : 2);
      }
    }
  }
  clearState() {
    let state = this.state//
    state.fields.splice(0);
    state.store.splice(0);
    state.data = {};
    this.setSelection("root");
  }
  emitEvent(type, data) {
    //处理外部事件
  }
  switchPlatform(platform) {
    let state = this.state
    state.platform = platform//
  }
}

export const createForm = (props: any) => { };
