<script>
import { ref, inject, nextTick, reactive, computed, watch, onMounted } from 'vue'
import hooks from '@DESIGN/hooks'
import {
  generateIfFilterOptionsData,
  generateIfFilterConditionsData,
  generateThenFilterOptionsData,
  generateThenFilterConditionsData,
  findValidFields
} from './generateFilterdata.js'
import _ from 'lodash'
import { EverrightFilter } from 'everright-filter'
import Icon from '@DESIGN/icon'
export default {
  name: 'ConfigLogicComponent'
}
</script>
<script setup>
const {
  t,
  lang
} = hooks.useI18n()
const tabs = ref([
  {
    value: 'visible',
    rules: [],
    ifRefs: [],
    thenRefs: []
  },
  {
    value: 'required',
    rules: [],
    ifRefs: [],
    thenRefs: []
  },
  {
    value: 'readOnly',
    rules: [],
    ifRefs: [],
    thenRefs: []
  }
  // 暂时放弃，后期来做
  // {
  //   label: '校验',
  //   value: 'validation',
  //   rules: [],
  //   ifRefs: [],
  //   thenRefs: []
  // }
])
const activeTab = ref('visible')
const ER = inject('Everright')
const scrollbarRef = ref()
const ns = hooks.useNamespace('ConfigLogicComponent')
const dialogVisible = ref(false)
const {
  state
} = hooks.useTarget()
const getIfOptions = (type) => async () => {
  return new Promise((resolve, reject) => {
    resolve({
      data: generateIfFilterOptionsData(type, findValidFields(state.fields))
    })
  })
}
const getIfConditions = (type) => async ({ property }) => {
  return new Promise((resolve, reject) => {
    resolve({
      data: generateIfFilterConditionsData(type, state, property)
    })
  })
}
const getThenOptions = (type) => async () => {
  return new Promise((resolve, reject) => {
    resolve({
      data: generateThenFilterOptionsData(type, findValidFields(state.fields))
    })
  })
}
const getThenConditions = (type) => async ({ property }) => {
  return new Promise((resolve, reject) => {
    resolve({
      data: generateThenFilterConditionsData(type, findValidFields(state.fields))
    })
  })
}
const curIndex = computed(() => _.findIndex(tabs.value, { value: activeTab.value }))
const getTabData = (tab) => {
  // const tab = _.find(tabs.value, { value: type })
  return tab.ifRefs.map((rule, index) => {
    return {
      ifRules: rule.getData(),
      thenRules: tab.thenRefs[index].getData()
    }
  })
}
const checkTab = (tab) => {
  let result = false
  if (tab.rules.length) {
    result = [...tab.ifRefs, ...tab.thenRefs].every(e => !_.isEmpty(e.getData()))
  } else {
    result = true
  }
  return result
}
const getData = () => {
  let index = 0
  let isSuccess = true
  const result = {}
  while (index < tabs.value.length) {
    if (!checkTab(tabs.value[index])) {
      activeTab.value = tabs.value[index].value
      isSuccess = false
      break
    }
    index++
  }
  if (isSuccess) {
    tabs.value.forEach(tab => {
      if (tab.rules.length) {
        result[tab.value] = getTabData(tab)
      }
    })
  }
  return result
}

const closeDialog = () => {
  dialogVisible.value = false
}
const openDialog = () => {
  dialogVisible.value = true
  tabs.value.forEach((tab, index) => {
    const rules = _.get(ER.state.logic, `${tab.value}`, [])
    remoteCount += rules.length * 2
    rules.forEach((rule, index) => {
      tab.rules.push(index)
    })
  })
}
const handleAction = (type) => {
  switch (type) {
    case 0:
      closeDialog()
      break
    case 1:
      const rules = tabs.value[curIndex.value].rules
      rules.push(rules.length)
      nextTick(() => {
        requestAnimationFrame(() => {
          scrollbarRef.value[curIndex.value].setScrollTop(scrollbarRef.value[curIndex.value].wrapRef.scrollHeight)
        })
      })
      break
    case 2:
      if (tabs.value.every(tab => !tab.rules.length)) {
        ER.state.logic = {}
        closeDialog()
        ER.fireEvent('logic:cancel', _.cloneDeep(ER.state.logic))
      } else {
        const data = getData()
        if (!_.isEmpty(data)) {
          ER.state.logic = getData(activeTab.value)
          closeDialog()
        }
        ER.fireEvent('logic:confirm', _.cloneDeep(ER.state.logic))
      }
      break
  }
}
const relationalRef = (tab, key, index) => {
  return (el) => {
    if (el) {
      tab[key][index] = el
    } else {
      tab[key].splice(index, 1)
    }
  }
}
let remoteCount = 0
const handleListener = (ruleType, index, tab, { type, data }) => {
  if (type === 'init') {
    if (remoteCount > 0) {
      const filterRef = _.get(tab, `${ruleType}Refs[${index}]`, {})
      nextTick(() => {
        filterRef.setData(_.get(ER.state.logic, `${tab.value}[${index}].${ruleType}Rules`, {}))
      })
      remoteCount = remoteCount - 1
    } else {
      if (ruleType === 'then') {
        switch (activeTab.value) {
          // case 'validation':
          //   _.last(tab.thenRefs).pushData('message')
          //   break
          case 'visible':
            _.last(tab.thenRefs).pushData('show')
            break
          case 'required':
            _.last(tab.thenRefs).pushData('required')
            break
          case 'readOnly':
            _.last(tab.thenRefs).pushData('readOnly')
            break
        }
      }
    }
  }
}
const addRuleHandler = (tab, index) => {
  switch (activeTab.value) {
    // case 'validation':
    //   // _.last(tab.thenRefs).pushData('message')
    //   break
    case 'visible':
      tab.thenRefs[index].pushData('show')
      break
    case 'required':
      tab.thenRefs[index].pushData('required')
      break
    case 'readOnly':
      tab.thenRefs[index].pushData('readOnly')
      break
  }
  return false
}
const handleClosed = () => {
  tabs.value.forEach(tab => {
    tab.rules = []
  })
}
</script>
<template>
  <el-drawer
    destroy-on-close
    size="60%"
    :modal="false"
    append-to-body
    :close-on-press-escape="false"
    :with-header="false"
    @closed="handleClosed"
    :class="[ns.b()]"
    v-model="dialogVisible">
    <div>
      <el-tabs v-model="activeTab" class="demo-tabs">
        <el-tab-pane v-for="tab in tabs" :label="t(`er.logic.tabs.${tab.value}`)" :name="tab.value" :key="tab.value">
          <el-scrollbar ref="scrollbarRef" max-height="calc(100vh - 210px)">
            <el-empty v-if="!tab.rules.length">
              <el-button type="primary" icon="plus" @click="handleAction(1)">{{ t('er.public.add')}}</el-button>
            </el-empty>
            <div v-else>
              <transition-group name="el-fade-in">
                <div :class="ns.e('rule')" v-for="(key, index) in tab.rules" :key="key">
                  <Icon @click="tab.rules.splice(index, 1)" :class="[ns.e('delRule')]" icon="delete"/>
                  <div :class="ns.e('if')">
                    <h3>{{ t('er.logic.filterLabel.if')}}</h3>
                    <EverrightFilter
                      :ref="relationalRef(tab, 'ifRefs', index)"
                      @listener="(e) => handleListener('if', index, tab, e)"
                      :lang="lang"
                      :getOptions="getIfOptions(tab.value)"
                      :getConditions="getIfConditions(tab.value)"
                    />
                  </div>
                  <div :class="[ns.e('then'), ns.e(`${tab.value}then`)]">
                    <h3>{{ t('er.logic.filterLabel.then')}}</h3>
                    <EverrightFilter
                      :ref="relationalRef(tab, 'thenRefs', index)"
                      :lang="lang"
                      :canAddRule="() => addRuleHandler(tab, index)"
                      @listener="(e) => handleListener('then', index, tab, e)"
                      :getOptions="getThenOptions(tab.value)"
                      :rule-limit="tab.value === 'required' ? 2 : tab.value === 'validation' ? 1 : -1"
                      :getConditions="getThenConditions(tab.value)"
                    />
                  </div>
                </div>
              </transition-group>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <el-button v-show="tabs[curIndex].rules.length" :class="[ns.e('button')]" @click="handleAction(1)">
        {{ t('er.public.add')}}
      </el-button>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleAction(0)">
          {{ t('er.public.cancel')}}
        </el-button>
        <el-button type="primary" @click="handleAction(2)">
          {{ t('er.public.confirm')}}
        </el-button>
      </span>
    </template>
  </el-drawer>
  <el-button style="width: 100%;" type="primary" @click="openDialog">
    {{ t('er.logic.button') }}
  </el-button>
</template>
