<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="include" :exclude="exclude" :max="max">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
import {toRefs} from "vue";
import {useRouter} from "vue-router";
import {argsState, keepAliveOpt} from "./store";
import {setBounds} from "./utils/ipc";

export default {
  setup() {
    const args = argsState();
    if (args) useRouter().replace(args.route);
    if (args.id === 1) setBounds([500, 300]);
    return {...toRefs(keepAliveOpt)};
  }
}
</script>
<style>
@import "../assets/main.css";
</style>
