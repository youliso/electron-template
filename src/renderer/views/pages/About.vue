<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <h5>This is an about page</h5>
      <button @click="toHome">首页</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Head from "../components/Head.vue";
import {createWindow} from "@/renderer/utils/ipc";
import {argsState} from "@/renderer/store";

export default defineComponent({
  components: {
    Head
  },
  name: "About",
  setup() {
    const args = argsState();

    function toHome() {
      createWindow({
        route: "/",
        isMainWin: true
      });
    }

    return {
      toHome
    }
  }
});
</script>

<style lang="scss">
.info {
  width: 100%;
  height: 100%;
  padding: 25px 10px 10px;
}
</style>
