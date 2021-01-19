<style lang="scss">
.info {
  width: 100%;
  height: 100%;
  padding: 30px 10px 10px;
}
</style>

<template>
  <div class="container" :class="platform" :style="{'--accentColor':'#'+accentColor}">
    <Head></Head>
    <div class="info">
      <div>内部资源内容: {{ readFileSync(getInsidePath("t.txt")).toString() }}</div>
      <div>外部资源内容: {{ readFileSync(getExternPath("t.txt")).toString() }}</div>
      <button @click="toAbout">关于</button>
      <button @click="test">弹个框</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, watch} from "vue";
import Head from "../components/Head.vue";
import {readFileSync} from "fs";
import {argsState, messageData} from "@/renderer/store";
import {createWindow} from "@/renderer/utils/window";
import {getInsidePath, getExternPath, getGlobal} from "@/lib";
import {WindowOpt} from "@/lib/interface";

export default defineComponent({
  components: {
    Head
  },
  name: "Home",
  setup() {
    const args = argsState();
    let watchTest = watch(() => messageData["test"], (n, o) => { // n 为新赋值 o为旧值
      console.log(n, o)
    });

    function test() {
      let data: WindowOpt = {
        route: "/message",
        parentId: args.id,
        data: {text: getGlobal("setting")},
        modal: true
      }
      createWindow(data);
    }

    function toAbout() {
      let data: WindowOpt = {
        route: "/about",
        width: 300,
        height: 300,
        isMainWin: true,
        resizable: true
      }
      createWindow(data);
    }

    onUnmounted(() => {
      watchTest()
    })

    return {
      platform: getGlobal("platform"),
      accentColor: getGlobal("appInfo")["accentColor"],
      readFileSync,
      getInsidePath,
      getExternPath,
      test,
      toAbout
    }
  }
});
</script>
