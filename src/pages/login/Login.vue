<template>
  <div class="">login</div>
</template>
<script lang="ts" setup>
import { FormOptions } from '@ER/formitem';

const formConfig: FormOptions = {
  items: [
    {
      field: 'eamil',
      label: '邮件',
      type: 'input',
      icon: '',
      key: '',
      id: '',
      options: {
        formConfig: undefined,
        clearable: false,
        isShowWordLimit: false,
        renderType: 0,
        disabled: false,
        showPassword: false,
        defaultValue: '',
        placeholder: '',
        labelWidth: 0,
        isShowLabel: false,
        required: false,
        min: 0,
        max: 0,
      },
      style: {
        width: {
          pc: '',
          mobile: '',
        },
      },
    },
  ],
};
</script>
<style scoped lang="less">
.login {
  min-height: max(100vh, 720px);
  margin-top: -78px;
}
</style>
