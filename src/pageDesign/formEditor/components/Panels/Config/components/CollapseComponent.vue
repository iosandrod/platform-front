<script>
import utils from '@DESIGN/utils'
import hooks from '@DESIGN/hooks'
import Icon from '@DESIGN/icon'
export default {
  name: 'ConfigCollapseComponent',
  customOptions: {}
}
</script>
<script setup>
const {
  target
} = hooks.useTarget()
const ns = hooks.useNamespace('ConfigCollapseComponent')
const props = defineProps({
  field: {
    type: String,
    required: true
  },
  operationKey: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div :class="ns.b()">
    <el-form-item>
      <template v-slot:label>
        <div :class="ns.e('label')">
          <div>
            <div>{{label}}</div>
            <slot name="subSelect" v-if="target[operationKey][field]"></slot>
          </div>
          <Icon :icon="target[operationKey][field] ? 'minus' : 'plus'" @click="target[operationKey][field] = !target[operationKey][field]"></Icon>
        </div>
      </template>
      <slot name="content" v-if="target[operationKey][field]"></slot>
    </el-form-item>
  </div>
</template>
