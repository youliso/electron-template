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
import { keepAliveData } from './store';

export default {
  setup() {
    return { keepAliveData };
  }
};
</script>
<style lang="scss">
@import 'views/scss/color';
@import 'views/scss/main';
</style>
