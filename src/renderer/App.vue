<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="include" :exclude="exclude" :max="keepAliveMax">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
import {toRefs} from 'vue';
import {useRouter} from "vue-router";
import {argsState} from "./store";
import {state} from "./store";

export default {
  setup() {
    let args = argsState();
    if (args) useRouter().replace(args.route);
    return {...toRefs(state)};
  }
}
</script>
<style>
@import "assets/main.css";
</style>