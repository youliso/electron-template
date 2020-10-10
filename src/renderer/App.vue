<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="$store.state.include.join(',')" :exclude="$store.state.exclude.join(',')" :max="$store.state.keepAliveMax">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
export default {
  created() {
    if (this.$Args) this.$router.replace(this.$Args.route)
  }
}
</script>
<style>
@import "assets/main.css";
</style>