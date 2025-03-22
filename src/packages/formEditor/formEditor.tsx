import { defineComponent, withDirectives } from 'vue';
import {
  ClickOutside as vClickOutside,
  ElMessage,
  ElDialog,
  ElScrollbar,
  ElContainer,
  ElHeader,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElButton,
} from 'element-plus';
import {
  defineProps,
  defineEmits,
  ref,
  reactive,
  computed,
  provide,
  getCurrentInstance,
  nextTick,
  onMounted,
  watch,
  defineExpose,
} from 'vue';
import fieldMenu from '@/menu/fieldCom';
import CanvesPanel from '@ER/formEditor/components/Panels/Canves';
import ConfigPanel from '@ER/formEditor/components/Panels/Config/configPanel';
import DeviceSwitch from '@ER/formEditor/components/DeviceSwitch.vue';
import ErFormPreview from './preview';
import Icon from '@ER/icon';
import hooks from '@ER/hooks';
import utils from '@ER/utils';
import _ from 'lodash';
import defaultProps from './defaultProps';
import generatorData from './generatorData';
import { staticData, testData1 } from './testData';
import { validate } from 'uuid';
import { Form } from '@ER/form';
import fieldCom from '@/menu/fieldCom';
export default defineComponent({
  directives: {
    vClickOutside,
  },
  components: {
    fieldMenu,
    fieldCom,
  },
  name: 'Everright-form-editor',
  props: {
    itemSpan: {
      type: Number,
      default: 6,
    },//
    fieldsPanelWidth: {
      type: String,
      default: '220px',
    },
    fieldsPanelDefaultOpeneds: {
      type: Array,
      default: () => ['defaultField', 'field', 'container'],
    },
    delHandle: {
      type: Function,
      default: () => { },
    },
    copyHandle: {
      type: Function,
      default: () => { },
    },
    inlineMax: {
      type: Number,
      default: 4,
    },
    isShowClear: {
      type: Boolean,
      default: true,
    },
    isShowI18n: {
      type: Boolean,
      default: true,
    },
    dragMode: {
      type: String,
      default: 'icon',
      validator: (value: any) => ['full', 'icon'].includes(value),
    },
    checkFieldsForNewBadge: {
      type: Function,
      default: () => { },
    },
    formIns: {
      type: Object,
    },
    ...defaultProps,
  },
  emits: ['listener'],
  setup(props: any, { attrs, slots, emit, expose }) {

    const form = ref('');
    const previewPlatform = ref('pc');
    const previewLoading = ref(true);

    let formIns: Form = props.formIns as any;
    // debugger//
    if (formIns == null) {
      formIns = new Form(props);
    } else {
    }
    provide('formIns', formIns);
    let layout = formIns.layout;
    const state = reactive({
      validate: null as any,
      store: [],
      selected: {},
      mode: 'edit',
      platform: 'pc',
      children: [],
      //@ts-ignore
      config: props.globalConfig,
      previewVisible: false,
      widthScaleLock: false,
      data: {},
      validateStates: [],
      fields: [],
      Namespace: 'formEditor',
      logic: {},
      othersFiles: {},
      fieldsLogicState: new Map(),
    });
    formIns.setState(state);
    const isFoldFields = computed({
      get: () => {
        return formIns.isDesign;
      },
      set: (val) => {
        formIns.setCurrentDesign(val);
      },
    });
    const isFoldConfig = computed({
      get: () => {
        return formIns.isDesign;
      },
      set: (val) => {
        formIns.setCurrentDesign(val);
      },
    });
    //@ts-ignore
    state.validator = (target, fn) => {
      if (target) {
        const count = _.countBy(state.validateStates, 'data.key');
        const newValue = target.key.trim();
        if (utils.isNull(newValue)) {
          _.find(state.validateStates, { data: { key: target.key } }).isWarning = true;
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
      } else {
        fn(state.validateStates.every((e) => !e.isWarning));
      }
    };
    const { t, lang } = hooks.useI18n(props);
    formIns.lang = lang
    formIns.t = t
    const EReditorPreviewRef = ref<any>('');
    const isShow = computed({
      get: () => {
        return formIns.isShow
      },
      set: (val) => {
        formIns.isShow = val
      },
    })
    const isShowConfig = computed({
      get: () => {
        return formIns.isShowConfig
      },
      set: (val) => {
        formIns.isShowConfig = val
      },
    });
    let setSelection = formIns.setSelection.bind(formIns);//
    setSelection(state.config);
    const addField = formIns.addField.bind(formIns);
    const delField = formIns.delField.bind(formIns);
    const addFieldData = formIns.addFieldData.bind(formIns);
    /* 
     
    */
    const wrapElement = formIns.wrapElement.bind(formIns);
    // setTimeout(() => {
    //   setData2(JSON.parse(JSON.stringify(testData1))); //
    // }, 100); 
    const syncLayout = formIns.syncLayout.bind(formIns);
    const getLayoutDataByplatform = formIns.getLayoutDataByplatform.bind(formIns);
    const switchPlatform = formIns.switchPlatform.bind(formIns);
    const canvesScrollRef = ref('');
    const fireEvent = (type, data) => {
      emit('listener', {
        type,
        data,
      });
    };
    const getData1 = () => {
      return utils.disassemblyData1(
        _.cloneDeep({
          list: state.store,
          config: state.config,
          data: state.data,
          logic: state.logic,
        })
      );
    };
    const getData2 = formIns.getLayoutData.bind(formIns);
    const setData1 = (data) => {
      if (_.isEmpty(data)) return false;
      const newData = utils.combinationData1(_.cloneDeep(data));
      isShow.value = false;
      state.store = newData.list;
      state.config = newData.config;
      state.data = newData.data;
      state.fields = newData.fields;
      state.logic = newData.logic;
      setSelection(state.config);
      state.store.forEach((e) => {
        utils.addContext({ node: e, parent: state.store }); //
      });
      nextTick(() => {
        isShow.value = true;
      });
    };
    const setData2 = formIns.setLayoutData.bind(formIns);
    const clearData = formIns.clearData.bind(formIns);
    // const getData = () => {
    //   if (!state.validateStates.every((e) => !e.isWarning)) {
    //     return {};
    //   } else {
    //     return (props.layoutType === 1 ? getData1 : getData2)();
    //   }
    // };
    const getData = formIns.getLayoutData.bind(formIns)
    const setData = props.layoutType === 1 ? setData1 : setData2;
    expose({
      form,
      switchPlatform(platform) {
        switchPlatform(platform);
      },
      setData,
      getData,
    });
    const handleOperation = (type, val?: any) => {
      switch (type) {
        case 1:
          break;
        case 2:
          // state.store = []
          layout.pc = [];
          layout.mobile = [];
          state.fields.splice(0);
          state.store.splice(0);
          state.data = {};
          setSelection('root');
          break;
        case 3:
          state.previewVisible = true;
          previewLoading.value = true;
          nextTick(() => {
            EReditorPreviewRef.value.setData(getData());
            nextTick(() => {
              previewLoading.value = false;
            });
          });
          break;
        case 4:
          fireEvent('save', getData());
          break;
        case 7:
          previewLoading.value = true;
          previewPlatform.value = val;

          EReditorPreviewRef.value.switchPlatform(val);
          EReditorPreviewRef.value.setData(getData());
          nextTick(() => {
            nextTick(() => {
              previewLoading.value = false;
            });
          });
          break;
      }
    };
    watch(
      () => state.fields.map((e) => e.id),
      (newV, old) => {
        const deleteFields = old.filter((item) => !newV.includes(item));
        const addFields = newV.filter((item) => !old.includes(item));
        for (const delField of deleteFields) {
          //
          formIns.delFormItem(delField);
        }
        for (const addField of addFields) {
          let field = state.fields.find((e) => e.id === addField);
          formIns.addFormItem(field); //
        }
      }
    );
    watch(
      () => state.selected,
      (newVal) => {
        fireEvent('changeParams', _.cloneDeep(newVal));
      },
      {
        deep: true,
        immediate: true,
      }
    );
    const onClickOutside = () => { };
    watch(
      () => {
        return state.store;
      },
      (newValue) => { },
      {
        deep: true,
      }
    );
    const eve = {
      formIns: formIns,
      state,
      setSelection,
      props,
      wrapElement,
      delField,
      addField, //
      switchPlatform,
      addFieldData,
      canvesScrollRef,
      fireEvent,
      getData,
      form,
    }; //
    provide('Everright', eve);
    return () => {
      let nextForm = formIns.nextForm; //
      let dialogCom = <ElDialog
        destroyOnClose
        fullscreen
        class='previewDialog'
        v-model={state.previewVisible}
        onClosed={() => (previewPlatform.value = 'pc')}
      >
        {{
          header: () => (
            <DeviceSwitch
              modelValue={previewPlatform.value}
              onUpdate:modelValue={(val) => handleOperation(7, val)}
            />
          ),
          default: () => (
            <ElScrollbar>
              <div class={{ previewDialogWrap: true, mobilePreview: previewPlatform.value === 'mobile' }}>
                <ErFormPreview {...props} formIns={formIns} ref={EReditorPreviewRef} />
              </div>
            </ElScrollbar>
          ),
        }}
      </ElDialog>
      if (!isFoldConfig.value) {
        dialogCom = null
      }
      let com = (
        <div class='h-full w-full'>
          {dialogCom}

          <ElContainer class='container' direction='vertical'>
            <ElContainer>
              {isFoldFields.value && <fieldCom></fieldCom>}
              <ElContainer class='container'>
                <ElHeader class='operation' style='display: flex;flex-derection: row;justify-content: space-between;'>
                  <div>
                    <Icon class='icon' icon='save' onClick={() => handleOperation(4)} />
                    {props.isShowClear && <Icon class='icon' icon='clear0' onClick={() => handleOperation(2)} />}
                    {slots['operation-left'] && slots['operation-left']()}
                  </div>
                  <div>
                    <DeviceSwitch modelValue={state.platform} onUpdate:modelValue={switchPlatform} />
                    <ElButton
                      onClick={() => {
                        formIns.setCurrentDesign(!formIns.isDesign)//
                      }}
                    >
                      测试
                    </ElButton>
                  </div>
                  <div>
                    {slots['operation-right'] && slots['operation-right']()}
                    {props.isShowI18n && (
                      <ElDropdown onCommand={(command) => fireEvent('lang', command)}>
                        <Icon class='icon' icon='language' />
                        {{
                          dropdown: () => (//
                            <ElDropdownMenu>
                              <ElDropdownItem command='zh-cn' disabled={lang.value === 'zh-cn'}>
                                中文
                              </ElDropdownItem>
                              <ElDropdownItem command='en' disabled={lang.value === 'en'}>
                                English
                              </ElDropdownItem>
                            </ElDropdownMenu>
                          ),
                        }}
                      </ElDropdown>
                    )}
                    <Icon class='icon' icon='preview' onClick={() => handleOperation(3)} />
                  </div>
                </ElHeader>

                {isShow.value && withDirectives(<CanvesPanel data={state.store} />, [[vClickOutside, onClickOutside]])}
              </ElContainer>
              {isFoldConfig.value && <ConfigPanel />}
            </ElContainer>
          </ElContainer>
          {/* <Everright-form-editor></Everright-form-editor> */}
        </div>
      );
      if (nextForm != null) {
        com = <Everright-form-editor formIns={nextForm}></Everright-form-editor>;
      } //
      return com; //
    };
  },
});
