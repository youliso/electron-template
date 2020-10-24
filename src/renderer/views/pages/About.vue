<template>
  <div class="main">
    <Head></Head>
    <div class="about">
      <h1>This is an about page</h1>
    </div>
    <button class="no-drag" @click="toHome">首页</button>
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
    setBounds([300, 200]);
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

<style scoped lang="scss">
.about {
  h1 {
    padding: 20px;
  }
}
</style>
