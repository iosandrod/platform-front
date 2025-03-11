<template>
  <div class="login flex items-center justify-center"></div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
function onLoginSuccess() {
  router.push('/workplace');
}
</script>
<style scoped lang="less">
.login {
  min-height: max(100vh, 720px);
  margin-top: -78px;
}
</style>
