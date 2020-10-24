<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <h1>This is an about page</h1>
      <button @click="toHome">首页</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onActivated} from "vue";
import Head from "../components/Head.vue";
import {closeWindow, createWindow, setBounds} from "../../utils/ipc";
import {argsState} from "../../store";

export default defineComponent({
  components: {
    Head
  },
  name: "About",
  setup() {
    const args = argsState();
    setBounds([300, 300]);
    const toHome = () => {
      closeWindow(args.id);
      let data: WindowOpt = {
        route: "/",
        isMainWin: true
      };
      createWindow(data);
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
