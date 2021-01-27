<style lang="scss">
.info {
  width: 100%;
  height: 100%;
  padding: 25px 10px 10px;
}
</style>

<template>
  <div class="container" :class="platform">
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
import {createWindow} from "@/renderer/utils/window";
import {argsData} from "@/renderer/store";

export default defineComponent({
  components: {
    Head
  },
  name: "About",
  setup() {

    function toHome() {
      createWindow({
        isMainWin: true,
        resizable: true
      });
    }

    return {
      platform: argsData.window.platform,
      toHome
    }
  }
});
</script>
