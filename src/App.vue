<template>
  <div class=" w-full h-full">
    <div id="container" class="w-full h-full"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { Table } from './platformClass/table';
import { options as _options } from './pages/login/data';
import * as VTable from '@visactor/vtable'
import { Client, client } from './service/client';
onMounted(() => {//
  let options = JSON.parse(JSON.stringify(_options))
  let uService = client.service('users')//
  options.container = document.getElementById('container')
  //@ts-ignore
  const table = new Table(options, uService)//////
  table.render(document.getElementById('container'))//
})
</script>

<style lang="less">
.stepin-view {
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background-color: theme('colors.primary.500');
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: theme('colors.primary.400');

    &:hover {
      background-color: theme('colors.primary.500');
    }
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
    border-radius: 4px;
    background: theme('backgroundColor.layout');
  }
}

html {
  height: 100vh;
  overflow-y: hidden;
}

body {
  margin: 0;
  height: 100vh;
  overflow-y: hidden;
}

.stepin-img-checkbox {
  @apply transition-transform;

  &:hover {
    @apply scale-105~"-translate-y-[2px]";
  }

  img {
    @apply shadow-low rounded-md transition-transform;
  }
}
</style>
