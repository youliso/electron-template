<template>
  <router-view v-slot="{ Component }">
    <keep-alive
      :include="keepAliveData.include"
      :exclude="keepAliveData.exclude"
      :max="keepAliveData.max"
    >
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
import { useRouter } from 'vue-router';
import { argsData, keepAliveData } from './store';

export default {
  setup() {
    if (argsData.window.route) useRouter().replace(argsData.window.route);
    return { keepAliveData };
  }
};
</script>
<style lang="scss">
@import 'views/scss/color';
@import 'views/scss/main';
</style>
