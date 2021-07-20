<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'" mode="out-in">
      <keep-alive
        :include="keepAliveData.include"
        :exclude="keepAliveData.exclude"
        :max="keepAliveData.max"
        :key="route.meta.usePathKey ? route.path : undefined"
      >
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>
<script lang="ts">
import { useRouter } from 'vue-router';
import { argsData, keepAliveData } from './store';
import { windowBlurFocus } from '@/renderer/utils/window';

export default {
  setup() {
    windowBlurFocus((envt, args) => {
      console.log(args);
    });
    if (argsData.window.route) useRouter().replace(argsData.window.route);
    return { keepAliveData };
  }
};
</script>
<style lang="scss">
@import 'views/scss/color';
@import 'views/scss/main';
</style>
