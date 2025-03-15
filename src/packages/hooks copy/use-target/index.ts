import { 
  computed, 
  inject, 
  ComputedRef 
} from 'vue';
import _ from 'lodash';
import utils from '@ER/utils';

type EverrightState = {
  selected: any;
  config: any;
  platform: string;
  mode: string;
};

type EverrightContext = {
  state: EverrightState;
  setSelection: (selection: any) => void;
  props: {
    checkPropsBySelected: (selected: any, propType: string) => boolean | undefined;
  };
};

export const useTarget = () => {
  const context = inject<EverrightContext>('Everright');
  if (!context) {
    throw new Error('Everright context is not provided');
  }

  const { state, setSelection, props } = context;

  const selection: ComputedRef<any> = computed(() => state.selected);
  const type: ComputedRef<string> = computed(() => state.selected?.type || '');

  const isSelectAnyElement = computed(() => state.selected !== state.config);
  const isSelectRoot = computed(() => state.selected === state.config);
  const isSelectField = computed(() => utils.checkIsField(state.selected));
  const target = computed(() => state.selected);
  const col = computed(() => !_.isEmpty(state.selected) && state.selected.context?.col);

  const checkTypeBySelected = (nodes: string[] = [], propType?: string): boolean => {
    if (_.isEmpty(state.selected)) return false;
    if (type.value) {
      const fn = props.checkPropsBySelected(state.selected, propType || '');
      return fn !== undefined ? fn : nodes.includes(type.value);
    }
    return nodes.includes(type.value);
  };

  const isSelectGrid = computed(() => checkTypeBySelected(['grid']));
  const isSelectTabs = computed(() => checkTypeBySelected(['tabs']));
  const isSelectCollapse = computed(() => checkTypeBySelected(['collapse']));
  const isSelectTable = computed(() => checkTypeBySelected(['table']));
  const isSelectSubform = computed(() => checkTypeBySelected(['subform']));
  
  const isPc = computed(() => state.platform === 'pc');
  const isEditModel = computed(() => /^(edit|config)$/.test(state.mode));

  return {
    state,
    setSelection,
    type,
    col,
    selection,
    isSelectAnyElement,
    isSelectField,
    target,
    checkTypeBySelected,
    isSelectGrid,
    isSelectTabs,
    isSelectCollapse,
    isSelectTable,
    isSelectRoot,
    isPc,
    isEditModel,
    isSelectSubform
  };
};
