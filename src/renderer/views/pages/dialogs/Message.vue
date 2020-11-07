<template>
  <div class="main">
    <Head></Head>
    <div class="info">
      <div class="text">
        {{ args.data.text }}
        <button @click="test">测试通讯</button>
      </div>
      <button class="close" @click="close">确定</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {argsState} from "../../../store";
import {closeWindow, send, setBounds} from "../../../utils/ipc";
import Head from "../../components/Head.vue";
import {IpcMsg, IPC_MSG_TYPE} from "../../../../lib/interface";

export default defineComponent({
  components: {
    Head
  },
  name: "Message",
  setup() {
    const args = argsState();
    setBounds([400, 150]);
    let cons = 0;
    const test = () => {//测试发送 为主窗口发送消息
      let data: IpcMsg = {
        type: IPC_MSG_TYPE.WIN,
        key: "test",
        value: cons++
      };
      send(data);
    }

    const close = () => {
      closeWindow(args.id);
    };

    return {
      args: argsState(),
      test,
      close
    }
  }
});
</script>

<style lang="scss">
.info {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 25px 10px 10px;

  .text {
    font: normal 16px sans-serif;
  }

  .close {
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
}
</style>
