<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <button @click="toAbout">关于</button>
      <button @click="test">弹个框</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, watch} from "vue";
import {createWindow} from "../../utils/ipc";
import Head from "../components/Head.vue";
import {argsState, messageData} from "../../store";

export default defineComponent({
  components: {
    Head
  },
  name: "Home",
  setup() {
    const args = argsState();
    let watchTest = watch(() => messageData["test"], (n, o) => { // o 为新赋值 n为旧值
      console.log(n, o)
    });
    const test = () => {
      createWindow({
        route: "/message",
        parentId: args.id,
        data: {text: "key不能为空"},
      });
    }
    const toAbout = () => {
      console.log("123")
      createWindow({
        route: "/about",
        width: 300,
        height: 300,
        isMainWin: true
      });
    }
    onUnmounted(() => {
      watchTest()
    })
    return {
      test,
      toAbout
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
