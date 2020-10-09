<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="$store.state.include" :exclude="$store.state.exclude" :max="$store.state.keepAliveMax">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  created() {
    if (this.$Args) this.$router.replace(this.$Args.route)
  }
});
</script>
<style>
@import "assets/main.css";
</style>