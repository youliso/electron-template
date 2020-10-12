<template>
  <div class="main">
    <Head></Head>
    <router-link class="no-drag" to="/about">手机</router-link>
    <button class="no-drag" @click="test">弹个框</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, watch} from "vue";
import {setBounds,dialogInit} from "../../utils/ipc";
import Head from "../components/Head.vue";
import {messageData} from "../../store";

export default defineComponent({
  components: {
    Head
  },
  name: "Home",
  setup() {
    setBounds([700, 300]);

    watch(() => messageData["test"], (n, o) => { // o 为新赋值 n为旧值
      console.log(n, o)
    })
    const test = () => {
      let data: DialogOpt = {
        route: "/message",
        data: {text: "key不能为空"},
      };
      dialogInit(data);
    }
    return {test}
  }
});
</script>

<style scoped>

</style>