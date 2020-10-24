<template>
  <div class="main">
    <Head></Head>
    <button class="no-drag" @click="toAbout">关于</button>
    <button class="no-drag" @click="test">弹个框</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, watch} from "vue";
import {setBounds, createWindow, closeWindow} from "../../utils/ipc";
import Head from "../components/Head.vue";
import {argsState, messageData} from "../../store";

export default defineComponent({
  components: {
    Head
  },
  name: "Home",
  setup() {
    const args = argsState();
    setBounds([500, 300]);
    let watchTest = watch(() => messageData["test"], (n, o) => { // o 为新赋值 n为旧值
      console.log(n, o)
    });
    const test = () => {
      let data: WindowOpt = {
        route: "/message",
        parentId: args.id,
        data: {text: "key不能为空"},
      };
      createWindow(data);
    }
    const toAbout = () => {
      closeWindow(args.id);
      let data: WindowOpt = {
        route: "/about",
        isMainWin: true
      };
      createWindow(data);
    }
    onUnmounted(() => {
      watchTest()
    })
    return {test, toAbout}
  }
});
</script>

<style scoped>

</style>
