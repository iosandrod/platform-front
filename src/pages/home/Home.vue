<script lang="ts" setup>
import { GithubFilled } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
function signIn() {
  router.push('/login');
}
</script>
<template>
  <div class="home text-center flex flex-col justify-center"></div>
</template>
<style scoped lang="less">
.home {
  min-height: max(100vh, 600px);
  margin-top: -78px;
}
</style>
