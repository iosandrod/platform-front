<script>
import { ElMessage } from 'element-plus'//
import { ref, computed, reactive, watchEffect, watch, unref, provide, onMounted, inject } from 'vue'
import utils from '@DESIGN/utils'
import hooks from '@DESIGN/hooks'
import PanelsConfigComponentsCheckboxComponent from './CheckboxComponent.vue'
import PanelsConfigComponentsCollapseComponent from './CollapseComponent.vue'
import PanelsConfigComponentsTypeComponent from './TypeComponent.vue'
import PanelsConfigComponentsBorderComponent from './BorderComponent.vue'
import PanelsConfigComponentsLimitComponent from './LimitComponent.vue'
import PanelsConfigComponentsAllsidesComponent from './AllsidesComponent.vue'
import PanelsConfigComponentsBackgroundComponent from './BackgroundComponent.vue'
import PanelsConfigComponentsDataComponent1 from './DataComponent1'
import PanelsConfigComponentsDataComponent2 from './DataComponent2'
import PanelsConfigComponentsDataComponent3 from './DataComponent3.vue'
import PanelsConfigComponentsSubformDefaultValue from './SubformDefaultValue.vue'
import Icon from '@DESIGN/icon'
import _ from 'lodash'
export default {
  name: 'ConfigPropsPanel',
  inheritAttrs: false,
  customOptions: {}
}
</script>
<script setup>
const ER = inject('Everright')
const ns = hooks.useNamespace('PropsPanel')
const {
  t
} = hooks.useI18n()
const {
  type,
  state,
  checkTypeBySelected,
  target,
  isSelectField,
  isSelectGrid,
  isSelectTabs,
  isSelectCollapse,
  isSelectTable,
  isPc,
  isSelectSubform
} = hooks.useTarget()
defineEmits(['changePanel'])
const bgStatus = ref(false)
provide('Everright-propsPanel', {
  bgStatus
})
const dialogVisible = ref(false)
const dataRef = ref()
const titleRef = ref()
const options = [
  {
    value: 'date',
    label: 'date'
  },
  {
    value: 'dates',
    label: 'dates'
  },
  {
    value: 'datetime',
    label: 'datetime'
  }, 
  {
    value: 'daterange',
    label: 'daterange'
  }
]
const options0 = computed(() => {
  let result = []
  if (checkTypeBySelected(['time'])) {
    result = [
      {
        label: 'HH:mm:ss',
        value: 'HH:mm:ss'
      },
      {
        label: 'HH时mm分ss秒',
        value: 'HH时mm分ss秒'
      }
    ]
  }
  if (checkTypeBySelected(['date'])) {
    if (target.value.options.type === 'datetime') {
      result = [
        {
          label: 'YYYY-MM-DD HH:mm:ss',
          value: 'YYYY-MM-DD HH:mm:ss'
        },
        {
          label: 'YYYY-MM-DD hh:mm:ss',
          value: 'YYYY-MM-DD hh:mm:ss'
        }
      ]
    } else {
      result = [
        {
          label: 'YYYY-MM-DD',
          value: 'YYYY-MM-DD'
        },
        {
          label: 'YYYY/MM/DD',
          value: 'YYYY/MM/DD'
        },
        {
          label: 'YYYY年MM月DD日',
          value: 'YYYY年MM月DD日'
        }
      ]
    }
  }
  return result
})
const widthOptions = ['1/4', '1/3', '1/2', '2/3', '3/4', '1']
const options1 = computed(() => {
  return widthOptions.map((e, index) => {
    const result = {
      value: e,
      disabled: false,
      icon: `widthRatioP${index + 1}`
    }
    const otherNodes = target.value.context.parent.columns
    switch (otherNodes.length) {
      case 2:
        result.disabled = /^(1)$/.test(result.value)
        break
      case 3:
        result.disabled = /^(1|3\/4|2\/3|1\/4)$/.test(result.value)
        break
    }
    return result
  })
})
const options2 = [
  'none',
  'solid',
  'dotted',
  'dashed',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset'
]
const options4 = computed(() => {
  return [
    {
      label: t('er.config.tabsLayout.style.options[0]'),
      value: '',
      icon: 'tabStyleP1'
    },
    {
      label: t('er.config.tabsLayout.style.options[1]'),
      value: 'card',
      icon: 'tabStyleP2'
    },
    {
      label: t('er.config.tabsLayout.style.options[2]'),
      value: 'border-card',
      icon: 'tabStyleP3'
    }
  ]
})
const options5 = computed(() => {
  return [
    {
      label: t('er.config.tabsLayout.tabPosition.options[0]'),
      value: 'top',
      icon: 'tabsLocationP1'
    },
    {
      label: t('er.config.tabsLayout.tabPosition.options[1]'),
      value: 'bottom',
      icon: 'tabsLocationP2'
    },
    {
      label: t('er.config.tabsLayout.tabPosition.options[2]'),
      value: 'left',
      icon: 'tabsLocationP3'
    },
    {
      label: t('er.config.tabsLayout.tabPosition.options[3]'),
      value: 'right',
      icon: 'tabsLocationP4'
    }
  ]
})
const options6 = computed(() => {
  return [
    {
      label: t('er.config.gridLayout.justify.options[0]'),
      value: 'start',
      icon: 'horizontalLayoutP1'
    },
    {
      label: t('er.config.gridLayout.justify.options[1]'),
      value: 'end',
      icon: 'horizontalLayoutP2'
    },
    {
      label: t('er.config.gridLayout.justify.options[2]'),
      value: 'center',
      icon: 'horizontalLayoutP3'
    },
    {
      label: t('er.config.gridLayout.justify.options[3]'),
      value: 'space-around',
      icon: 'horizontalLayoutP4'
    },
    {
      label: t('er.config.gridLayout.justify.options[4]'),
      value: 'space-between',
      icon: 'horizontalLayoutP5'
    }
  ]
})
const options7 = computed(() => {
  return [
    {
      label: t('er.config.propsPanel.layout.options[0]'),
      value: 'block'
    },
    {
      label: t('er.config.propsPanel.layout.options[1]'),
      value: 'inline'
    }
  ]
})
const options8 = computed(() => {
  return [
    {
      label: t('er.config.propsPanel.region.options[0]'),
      value: 1
    },
    {
      label: t('er.config.propsPanel.region.options[1]'),
      value: 2
    },
    {
      label: t('er.config.propsPanel.region.options[2]'),
      value: 3
    }
  ]
})
const options9 = computed(() => {
  return [
    {
      icon: 'numberButtonP2',
      value: false
    },
    {
      icon: 'numberButtonP1',
      value: true
    }
  ]
})
const options10 = computed(() => {
  return [
    {
      icon: 'dividerLocationP1',
      value: 'left'
    },
    {
      icon: 'dividerLocationP2',
      value: 'center'
    },
    {
      icon: 'dividerLocationP3',
      value: 'right'
    }
  ]
})
// const typeProps = computed(() => {
//   return utils.bindProps(target.value, true)
// })
const typeProps = hooks.useProps(state, target, true, false, (type, props) => {
  switch (type) {
    case 'time':
    case 'cascader':
    case 'number':
    case 'date':
    case 'rate':
    case 'switch':
    case 'slider':
      delete props.disabled
      break
  }
})
const checkLogicData = () => {
  if (utils.checkIdExistInLogic(target.value.id, state.logic)) {
    ElMessage({
      showClose: true,
      duration: 4000,
      message: t('er.logic.logicSuggests'),
      type: 'warning'
    })
    utils.removeLogicDataByid(target.value.id, state.logic)
  }
}
const handleChange0 = (value) => {
  checkLogicData()
  if (/^(dates|datarange)$/.test(value)) {
    target.value.options.defaultValue = []
  } else {
    target.value.options.defaultValue = ''
  }
  if (!options0.value.includes(value)) {
    target.value.options.format = options0.value[0].value
  }
}
const handleChange1 = () => {
  checkLogicData()
  target.value.options.defaultValue = ''
}
const handleMultipleChange = (value) => {
  checkLogicData()
  if (value) {
    target.value.options.defaultValue = []
  } else {
    target.value.options.defaultValue = ''
  }
}
const handleAccordionChange = (value) => {
  // if (value) {
  //   target.value.options.defaultValue = []
  //   if (target.value.columns.length) {
  //     target.value.options.defaultValue.push(target.value.columns[0].id)
  //   }
  // } else {
  //   target.value.options.defaultValue = ''
  // }
}
const handleAction = (type, value) => {
  switch (type) {
    case 1:
      if (state.mode === 'config') {
        unref(dataRef).getData().then(({ data }) => {
          dialogVisible.value = false
        })
        return false
      }
      if (checkTypeBySelected(['cascader'])) {
        unref(dataRef).getData().then(({ data }) => {
          state.data[target.value.options.dataKey].list = data
          dialogVisible.value = false
        })
      } else {
        unref(dataRef).getData().then(({ data, defaultValue }) => {
          state.data[target.value.options.dataKey].list = data
          target.value.options.defaultValue = defaultValue
          target.value.options.otherRequired = _.findIndex(data, { value: 'other' }) !== -1
          dialogVisible.value = false
        })
      }
      break
    case 2:
      dialogVisible.value = false
      break
  }
}
const handleTypeListener = ({ property, data }) => {
  switch (property) {
    case 'width':
      // eslint-disable-next-line
      const val = Number((eval(data.value) * 100).toFixed(2))
      utils.syncWidthByPlatform(target.value, state.platform, false, val)
      break
    case 'type':
      target.value.options.type = data.value
      break
    case 'tabPosition':
      target.value.options.tabPosition = data.value
      break
    case 'justify':
      target.value.options.justify = data.value
      break
    case 'displayStyle':
      target.value.options.displayStyle = data.value
      break
    case 'selectType':
      target.value.options.selectType = data.value
      target.value.options.defaultValue = ''
      break
    case 'controlsPosition':
      target.value.options.controlsPosition = data.value
      break
    case 'contentPosition':
      target.value.options.contentPosition = data.value
      break
  }
}
const isShowotherRequired = computed(() => {
  let result = false
  result = isSelectField.value && checkTypeBySelected(['select', 'checkbox', 'radio'], 'otherRequired')
  const datalist = _.get(state.data[target.value.options.dataKey], 'list', [])
  result = _.findIndex(datalist, { value: 'other' }) !== -1
  return result
})
onMounted(() => {
  titleRef.value && titleRef.value.focus()
})
</script>
<template>
  <div :class="ns.b()">
    <el-form-item v-bind="utils.addTestId('configPanel:id')" v-if="isSelectField" :label="t('er.config.propsPanel.id')"
      prop="key">
      <el-input v-model="target.key" />
    </el-form-item>
    <PanelsConfigComponentsCollapseComponent v-if="isSelectField" :label="t('er.config.propsPanel.title')"
      operationKey="options" field="isShowLabel" v-bind="utils.addTestId('propsPanel:title')">
      <template v-slot:content>
        <div :class="[ns.e('collapseWrap'), ns.e('collapseWrap-left')]">
          <el-row justify="space-between" align="middle">
            <el-col :span="isSelectSubform ? 24 : (isPc ? 11 : 24)">
              <el-form-item v-bind="utils.addTestId('configPanel:title')">
                <template v-slot:label>
                  <Icon icon="title" />
                </template>
                <el-input ref="titleRef" clearable v-model="target.label" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="isPc && !isSelectSubform">
              <el-form-item v-bind="utils.addTestId('configPanel:titleWidth')">
                <template v-slot:label>
                  <Icon icon="dragWidth" />
                </template>
                <el-input-number controls-position="right" v-model="target.options.labelWidth" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </template>
    </PanelsConfigComponentsCollapseComponent>
    <PanelsConfigComponentsTypeComponent :label="t('er.config.propsPanel.defaultContent')" :layoutType="0" v-if="checkTypeBySelected(['subform'], 'defaultValue') ? target.list[0].length : checkTypeBySelected([
      'input',
      'textarea',
      'time',
      'date',
      'number',
      'rate',
      'color',
      'switch',
      'slider',
      'button',
      'divider',
      'cascader',
      'region'
    ], 'defaultValue')">
      <template v-if="checkTypeBySelected(['cascader', 'region'], 'defaultValue')">
        <el-cascader :class="[utils.addTestId('configPanel-defaultValue', 'id')]" v-model="target.options.defaultValue"
          v-bind="typeProps" clearable style="width: 100%;" />
      </template>
      <template v-else-if="checkTypeBySelected(['textarea'], 'defaultValue')">
        <el-input type="textarea" rows="4" v-model="target.options.defaultValue"
          v-bind="utils.addTestId('configPanel:defaultValue')" />
      </template>
      <template v-else-if="checkTypeBySelected(['input', 'divider'], 'defaultValue')">
        <el-input v-model="target.options.defaultValue" clearable
          v-bind="utils.addTestId('configPanel:defaultValue')" />
      </template>
      <template v-else-if="checkTypeBySelected(['number'], 'defaultValue')">
        <el-input-number style="width: 100%;" v-bind="_.merge(typeProps, utils.addTestId('configPanel:defaultValue'))"
          v-model="target.options.defaultValue" />
      </template>
      <template v-else-if="checkTypeBySelected(['time'], 'defaultValue')">
        <el-time-picker v-bind="typeProps" style="width: 100%" clearable v-model="target.options.defaultValue" />
      </template>
      <template v-else-if="checkTypeBySelected(['date'], 'defaultValue')">
        <el-date-picker :class="[utils.addTestId('configPanel-defaultValue', 'id')]" v-bind="typeProps"
          style="width: 100%" v-model="target.options.defaultValue" clearable />
      </template>
      <template v-else-if="checkTypeBySelected(['rate'], 'defaultValue')">
        <el-rate v-bind="_.merge(typeProps, utils.addTestId('configPanel:defaultValue'))"
          v-model="target.options.defaultValue" />
        <el-button v-if="target.options.defaultValue > 0" link @click="target.options.defaultValue = 0">{{
          t('er.public.clear') }}</el-button>
      </template>
      <template v-else-if="checkTypeBySelected(['switch'], 'defaultValue')">
        <el-switch v-bind="_.merge(typeProps, utils.addTestId('configPanel:defaultValue'))"
          v-model="target.options.defaultValue" />
      </template>
      <template v-else-if="checkTypeBySelected(['slider'], 'defaultValue')">
        <el-slider v-bind="_.merge(typeProps, utils.addTestId('configPanel:defaultValue'))"
          v-model="target.options.defaultValue" style="padding: 0 14px;" />
      </template>
      <template v-else-if="checkTypeBySelected(['subform'], 'defaultValue')">
        <PanelsConfigComponentsSubformDefaultValue />
      </template>
    </PanelsConfigComponentsTypeComponent>
    <PanelsConfigComponentsTypeComponent :label="t('er.public.Data')" :layoutType="0"
      v-if="checkTypeBySelected(['select', 'radio', 'checkbox', 'cascader'], 'dataEntry')">
      <el-button style="width: 100%;" type="primary" @click="dialogVisible = true"
        v-bind="utils.addTestId('configPanel:dataEntry')">
        {{ t('er.public.dataEntry') }}
      </el-button>
    </PanelsConfigComponentsTypeComponent>
    <PanelsConfigComponentsTypeComponent :label="t('er.config.propsPanel.star')" :layoutType="0"
      v-if="checkTypeBySelected(['rate'], 'star')">
      <el-input-number v-bind="utils.addTestId('configPanel:star')" :min="1" controls-position="right"
        v-model="target.options.max" />
    </PanelsConfigComponentsTypeComponent>
    <!-- placeholder -->
    <PanelsConfigComponentsTypeComponent :layoutType="0" :label="t('er.config.propsPanel.placeholder')" v-if="checkTypeBySelected([
      'input',
      'textarea',
      'select',
      'cascader',
      'time',
      'date',
      'html',
      'region'
    ], 'placeholder')">
      <el-input
        v-if="checkTypeBySelected(['input', 'select', 'cascader', 'time', 'date', 'html', 'region'], 'placeholder')"
        v-model="target.options.placeholder" clearable v-bind="utils.addTestId('configPanel:placeholder')" />
      <el-input v-else-if="checkTypeBySelected(['textarea'], 'placeholder')" type="textarea"
        v-model="target.options.placeholder" clearable v-bind="utils.addTestId('configPanel:placeholder')" />
    </PanelsConfigComponentsTypeComponent>
    <PanelsConfigComponentsTypeComponent :layoutType="0" :label="t('er.config.propsPanel.otherPlaceholder')" v-if="checkTypeBySelected([
      'checkbox',
      'radio',
      'select',
    ], 'placeholder') && target.options.otherRequired">
      <el-input type="textarea" v-model="target.options.otherPlaceholder" clearable
        v-bind="utils.addTestId('configPanel:otherPlaceholder')" />
    </PanelsConfigComponentsTypeComponent>
    <PanelsConfigComponentsTypeComponent :layoutType="0" v-if="checkTypeBySelected(['signature'], 'brushColor')"
      :label="t('er.config.propsPanel.brushColor')" v-bind="utils.addTestId('configPanel:brushColor')">
      <el-color-picker color-format="rgb" v-model="target.options.penColor" />
    </PanelsConfigComponentsTypeComponent>
    <PanelsConfigComponentsTypeComponent v-if="checkTypeBySelected(['time', 'date'], 'format')" :layoutType="0"
      :label="t('er.config.propsPanel.format')">
      <el-select v-model="target.options.format" style="width: 100%" v-bind="utils.addTestId('configPanel:format')">
        <el-option v-for="item in options0" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </PanelsConfigComponentsTypeComponent>
    <PanelsConfigComponentsTypeComponent v-if="checkTypeBySelected(['date'], 'dateType')" :layoutType="0"
      :label="t('er.config.propsPanel.dateType')">
      <el-select v-model="target.options.type" @change="handleChange0" style="width: 100%"
        v-bind="utils.addTestId('configPanel:dateType')">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </PanelsConfigComponentsTypeComponent>
    <PanelsConfigComponentsTypeComponent v-if="checkTypeBySelected(['radio', 'checkbox'], 'displayStyle')"
      @listener="handleTypeListener" property="displayStyle" :label="t('er.config.propsPanel.layout.label')"
      :val="target.options.displayStyle" :nodes="options7" :layoutType="2"
      v-bind="utils.addTestId('configPanel:displayStyle')" />
    <PanelsConfigComponentsTypeComponent v-if="checkTypeBySelected(['divider'], 'contentPosition')"
      :label="t('er.config.propsPanel.contentPosition.label')" @listener="handleTypeListener" property="contentPosition"
      :height="50" :fontSize="80" :nodes="options10" :val="target.options.contentPosition"
      v-bind="utils.addTestId('configPanel:contentPosition')" />
    <PanelsConfigComponentsTypeComponent :layoutType="0" v-if="checkTypeBySelected(['textarea'], 'textareaHeight')"
      :label="t('er.config.propsPanel.textareaHeight')">
      <el-slider v-model="target.options.rows" :max="10" show-input
        v-bind="utils.addTestId('configPanel:textareaHeight')" />
    </PanelsConfigComponentsTypeComponent>
    <div v-if="checkTypeBySelected(['uploadfile'], 'uploadfile')">
      <el-form-item :label="t('er.config.propsPanel.uploadfile.fileType')"
        v-bind="utils.addTestId('configPanel:accept')">
        <el-input v-model="target.options.accept" placeholder="输入只接受的文件类型后缀。例如 .png,.jpg" />
      </el-form-item>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item :label="t('er.config.propsPanel.uploadfile.uploadLimit')"
            v-bind="utils.addTestId('configPanel:uploadLimit')">
            <el-input-number style="width: 100%;" :min="1" controls-position="right" v-model="target.options.limit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${t('er.config.propsPanel.uploadfile.fileSize')}(MB)`"
            v-bind="utils.addTestId('configPanel:fileSize')">
            <el-input-number style="width: 100%;" v-model="target.options.size" controls-position="right" :min="1" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-row v-if="checkTypeBySelected(['input'], 'affix') && target.options.renderType === 1 && isPc" :gutter="8">
      <el-col :span="12">
        <el-form-item :label="t('er.config.propsPanel.prepend')" v-bind="utils.addTestId('configPanel:prepend')">
          <el-input style="width: 100%;" v-model="target.options.prepend" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="t('er.config.propsPanel.append')" v-bind="utils.addTestId('configPanel:append')">
          <el-input style="width: 100%;" v-model="target.options.append" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8" v-if="checkTypeBySelected(['number', 'slider'], 'step')">
      <el-col :span="type !== 'slider' ? 12 : 24">
        <el-form-item :label="t('er.config.propsPanel.step')" v-bind="utils.addTestId('configPanel:step')">
          <el-input-number :min="0" style="width: 100%;" controls-position="right" v-model="target.options.step" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item v-if="type !== 'slider'" :label="t('er.config.propsPanel.precision')"
          v-bind="utils.addTestId('configPanel:precision')">
          <el-input-number :min="0" controls-position="right" v-model="target.options.precision" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8" v-if="checkTypeBySelected(['slider'], 'sliderCount')"
      v-bind="utils.addTestId('configPanel:sliderCount')">
      <el-col :span="12">
        <el-form-item :label="t('er.public.max')">
          <el-input-number controls-position="right" v-model="target.options.max" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="t('er.public.min')">
          <el-input-number controls-position="right" v-model="target.options.min" />
        </el-form-item>
      </el-col>
    </el-row>
    <PanelsConfigComponentsTypeComponent v-if="checkTypeBySelected(['region'], 'regionType')"
      :label="t('er.config.propsPanel.region.label')" :layoutType="0"
      v-bind="utils.addTestId('configPanel:regionType')">
      <el-select v-model="target.options.selectType" @change="handleChange1">
        <el-option v-for="item in options8" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </PanelsConfigComponentsTypeComponent>
    <PanelsConfigComponentsTypeComponent
      v-if="utils.checkIslineChildren(target) && target.context.parent.columns.length !== 4 && !(ER.props.layoutType === 1 && !isPc)"
      @listener="handleTypeListener" property="width" :label="t('er.public.width')" :height="40" :fontSize="28"
      :nodes="options1" v-bind="utils.addTestId('configPanel:width')" />
    <PanelsConfigComponentsCheckboxComponent v-if="checkTypeBySelected(['input', 'textarea'], 'isShowTrim')"
      :label="t('er.config.propsPanel.trim')" field="isShowTrim" v-bind="utils.addTestId('configPanel:isShowTrim')" />
    <PanelsConfigComponentsCheckboxComponent
      v-if="(checkTypeBySelected(['input'], 'wordLimit') && target.options.renderType === 1) || checkTypeBySelected(['textarea', 'number'], 'wordLimit')"
      :label="t('er.config.propsPanel.wordLimit')" field="isShowWordLimit"
      v-bind="utils.addTestId('configPanel:wordLimit')">
      <el-row align="middle" :gutter="8">
        <el-col :span="11">
          <el-form-item :label="t('er.public.min')">
            <el-input-number controls-position="right"
              :max="(target.options.max === null || target.options.max === undefined) ? undefined : target.options.max - 1"
              v-model="target.options.min" />
          </el-form-item>
        </el-col>
        <el-col :span="2">~</el-col>
        <el-col :span="11">
          <el-form-item :label="t('er.public.max')">
            <el-input-number :min="target.options.min + 1" controls-position="right" :step="10"
              v-model="target.options.max" />
          </el-form-item>
        </el-col>
      </el-row>
    </PanelsConfigComponentsCheckboxComponent>
    <PanelsConfigComponentsCheckboxComponent v-if="checkTypeBySelected(['date'], 'dateRange')"
      :label="t('er.config.propsPanel.dateRange')" field="isShowWordLimit"
      v-bind="utils.addTestId('configPanel:dateRange')">
      <PanelsConfigComponentsLimitComponent />
    </PanelsConfigComponentsCheckboxComponent>
    <PanelsConfigComponentsCheckboxComponent
      v-if="isSelectField && !checkTypeBySelected(['rate', 'switch', 'slider', 'divider'], 'required')"
      :label="t('er.validateMsg.required')" field="required" v-bind="utils.addTestId('configPanel:required')" />
    <PanelsConfigComponentsCheckboxComponent v-if="isShowotherRequired" :label="t('er.config.propsPanel.otherRequired')"
      field="otherRequired" v-bind="utils.addTestId('configPanel:otherRequired')" />
    <PanelsConfigComponentsTypeComponent v-if="isSelectGrid" @listener="handleTypeListener" property="justify"
      :label="t('er.config.gridLayout.justify.label')" :height="40" :fontSize="40" :val="target.options.justify"
      :nodes="options6" v-bind="utils.addTestId('configPanel:justify')" />
    <PanelsConfigComponentsDataComponent3 v-if="checkTypeBySelected(['collapse', 'tabs'], 'Data3')"
      v-bind="utils.addTestId('configPanel:dataEntry3')" />
    <PanelsConfigComponentsTypeComponent v-if="isSelectTabs" @listener="handleTypeListener" property="type"
      :label="t('er.config.tabsLayout.style.label')" :height="66" :fontSize="70" :val="target.options.type"
      :nodes="options4" v-bind="utils.addTestId('configPanel:tabsType')" />
    <PanelsConfigComponentsTypeComponent v-if="isSelectTabs" @listener="handleTypeListener" property="tabPosition"
      :label="t('er.config.tabsLayout.tabPosition.label')" :height="40" :fontSize="66" :val="target.options.tabPosition"
      :nodes="options5" v-bind="utils.addTestId('configPanel:tabPosition')" />
    <PanelsConfigComponentsCollapseComponent
      v-if="checkTypeBySelected(['table', 'grid', 'col', 'collapse', 'collapseCol', 'tabs', 'tabsCol'], 'margin')"
      :label="t('er.public.margin')" operationKey="style" field="isShowMargin"
      v-bind="utils.addTestId('configPanel:margin')">
      <template v-slot:content>
        <PanelsConfigComponentsAllsidesComponent field="margin" />
      </template>
    </PanelsConfigComponentsCollapseComponent>

    <PanelsConfigComponentsCollapseComponent
      v-if="checkTypeBySelected(['grid', 'col', 'collapse', 'collapseCol', 'tabs', 'tabsCol', 'td'], 'padding')"
      :label="t('er.public.padding')" operationKey="style" field="isShowPadding"
      v-bind="utils.addTestId('configPanel:padding')">
      <template v-slot:content>
        <PanelsConfigComponentsAllsidesComponent field="padding" />
      </template>
    </PanelsConfigComponentsCollapseComponent>
    <PanelsConfigComponentsCollapseComponent
      v-if="checkTypeBySelected(['grid', 'col', 'collapse', 'collapseCol', 'tabs', 'tabsCol', 'td', 'table'], 'background')"
      :label="t('er.public.background')" operationKey="style" field="isShowBackground"
      v-bind="utils.addTestId('configPanel:background')">
      <template v-slot:subSelect>
        <div :class="[ns.e('collapseSubSelect')]">
          <el-dropdown @command="(command) => { bgStatus = command }">
            <span>
              {{ bgStatus ? t('er.public.image') : t('er.public.color') }}<el-icon class="el-icon--right">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="">
                  <path fill="currentColor"
                    d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z">
                  </path>
                </svg>
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="0">{{ t('er.public.color') }}</el-dropdown-item>
                <el-dropdown-item :command="1">{{ t('er.public.image') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
      <template v-slot:content>
        <PanelsConfigComponentsBackgroundComponent />
      </template>
    </PanelsConfigComponentsCollapseComponent>
    <!--  <PanelsConfigComponentsBackgroundComponent-->
    <!--    v-if="checkTypeBySelected(['grid', 'col', 'collapse', 'collapseCol', 'tabs', 'tabsCol', 'td', 'table'])"-->
    <!--  />-->
    <PanelsConfigComponentsCollapseComponent
      v-if="checkTypeBySelected(['grid', 'col', 'collapse', 'collapseCol', 'tabs', 'tabsCol', 'table'], 'borderLine')"
      :label="t('er.config.borderComponent.borderLine')" operationKey="style" field="isShowBorder"
      v-bind="utils.addTestId('configPanel:borderLine')">
      <template v-if="!checkTypeBySelected(['table', 'borderLine'])" v-slot:subSelect>
        <div :class="[ns.e('collapseSubSelect')]">
          <el-dropdown @command="(command) => target.style.border.style = command">
            <span>
              {{ target.style.border && target.style.border.style }}<el-icon class="el-icon--right">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="">
                  <path fill="currentColor"
                    d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z">
                  </path>
                </svg>
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="item" v-for="item in options2" :key="item">{{ item }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
      <template v-slot:content>
        <div :class="[ns.e('collapseWrap'), ns.e('collapseWrap-left')]">
          <PanelsConfigComponentsBorderComponent />
        </div>
      </template>
    </PanelsConfigComponentsCollapseComponent>
    <PanelsConfigComponentsCheckboxComponent v-if="isSelectCollapse" :label="t('er.config.propsPanel.accordion')"
      @change="handleAccordionChange" field="accordion" v-bind="utils.addTestId('configPanel:accordion')">
    </PanelsConfigComponentsCheckboxComponent>
    <template v-if="isSelectField && !checkTypeBySelected(['divider'])">
      <PanelsConfigComponentsCheckboxComponent :label="t('er.public.disabled')" field="disabled"
        v-bind="utils.addTestId('configPanel:disabled')">
      </PanelsConfigComponentsCheckboxComponent>
      <PanelsConfigComponentsCheckboxComponent
        v-if="checkTypeBySelected(['input'], 'showPassword') && target.options.renderType === 1"
        :label="t('er.config.propsPanel.showPassword')" field="showPassword">
      </PanelsConfigComponentsCheckboxComponent>
      <PanelsConfigComponentsCheckboxComponent
        v-if="checkTypeBySelected(['select', 'cascader', 'uploadfile'], 'multiple')"
        :label="t('er.config.propsPanel.multiple')" @change="handleMultipleChange" field="multiple"
        v-bind="utils.addTestId('configPanel:multiple')">
      </PanelsConfigComponentsCheckboxComponent>
      <PanelsConfigComponentsCheckboxComponent
        v-if="checkTypeBySelected(['select', 'cascader', 'transfer', 'region'], 'filterable')"
        :label="t('er.config.propsPanel.filterable')" field="filterable"
        v-bind="utils.addTestId('configPanel:filterable')">
      </PanelsConfigComponentsCheckboxComponent>
      <PanelsConfigComponentsCheckboxComponent v-if="isPc && checkTypeBySelected(['number'], 'controls')"
        :label="t('er.config.propsPanel.numberControls.label')" field="controls"
        v-bind="utils.addTestId('configPanel:controls')">
        <PanelsConfigComponentsTypeComponent @listener="handleTypeListener" property="controlsPosition" :height="30"
          :fontSize="50" :nodes="options9" :val="target.options.controlsPosition" />
      </PanelsConfigComponentsCheckboxComponent>
      <PanelsConfigComponentsCheckboxComponent v-if="checkTypeBySelected(['rate'], 'allowHalf')"
        :label="t('er.config.propsPanel.allowHalf')" field="allowHalf"
        v-bind="utils.addTestId('configPanel:allowHalf')">
      </PanelsConfigComponentsCheckboxComponent>
      <PanelsConfigComponentsCheckboxComponent v-if="checkTypeBySelected(['color'], 'alpha')"
        :label="t('er.config.propsPanel.alpha')" field="showAlpha">
      </PanelsConfigComponentsCheckboxComponent>
      <PanelsConfigComponentsCheckboxComponent v-if="checkTypeBySelected(['cascader'], 'anyNode')"
        :label="t('er.config.propsPanel.anyNode')" field="checkStrictly" @change="checkLogicData"
        v-bind="utils.addTestId('configPanel:anyNode')" />
      <PanelsConfigComponentsCheckboxComponent
        v-if="checkTypeBySelected(['input', 'select', 'time', 'date', 'cascader', 'region'], 'clearable')"
        :label="t('er.config.propsPanel.clearable')" field="clearable"
        v-bind="utils.addTestId('configPanel:clearable')">
      </PanelsConfigComponentsCheckboxComponent>
    </template>
  </div>
  <el-dialog v-model="dialogVisible" :title="t('er.public.dataEntry')" :destroy-on-close="true"
    :close-on-click-modal="false" :close-on-press-escape="false" append-to-body width="80%" draggable>
    <PanelsConfigComponentsDataComponent2 v-if="checkTypeBySelected(['cascader'], 'data2')" ref="dataRef">
    </PanelsConfigComponentsDataComponent2>
    <PanelsConfigComponentsDataComponent1 v-else ref="dataRef"></PanelsConfigComponentsDataComponent1>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleAction(2)">
          {{ t('er.public.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleAction(1)">
          {{ t('er.public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
