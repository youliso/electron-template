<template>
  <div class="main">
    <Head></Head>
    <div>{{ args.data }}</div>
    <button class="no-drag" @click="test">test</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {argsState} from "../../store";
import {setBounds, send} from "../../utils/ipc";
import Head from "../components/Head.vue";

export default defineComponent({
  components: {
    Head
  },
  name: "Message",
  setup() {
    setBounds([400, 150]);
    let cons = 0;
    const test = () => {//测试发送 为主窗口发送消息
      let data: IpcMessageOpt = {
        type: "dialog",
        key: "test",
        value: cons++
      };
      send(data);
    }
    return {args: argsState(), test};
  }
});
</script>

<style scoped>

</style>