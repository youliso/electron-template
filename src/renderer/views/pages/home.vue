<template>
  <div class="container">
    <div class="info">hello</div>
    <div class="btns">
      <button @click="tk">弹框</button>
      <button @click="toBilibili">bilibili</button>
      <template v-if="platform === 'win32'">
        <button @click="toWin32">win32Box</button>
        <button @click="toWin32Set">set</button>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { windowCreate, windowMessageOn, windowShow } from '@youliso/electronic/ipc';

export default defineComponent({
  setup() {
    //监听弹框消息
    windowMessageOn('test', (args: any) => {
      console.log(args);
    });

    const tk = () => {
      windowCreate(
        {
          title: '弹框测试',
          route: '/message',
          data: { text: '123' },
          position: 'center'
        },
        {
          width: 440,
          height: 220,
          frame: true,
          show: false,
          modal: true,
          resizable: true,
          webPreferences: {
            devTools: true
          }
        },
        { openDevTools: true }
      );
    };

    const toBilibili = () => {
      windowCreate(
        {
          loadType: 'url',
          url: 'https://www.bilibili.com/',
          position: 'center'
        },
        {
          width: 800,
          height: 600,
          modal: true,
          resizable: true
        }
      );
    };

    const toWin32 = () => {
      window.win32.messageBox().then(console.log);
    };

    const toWin32Set = () => {
      window.win32.dwmSetWindowAttribute(window.customize.winId).then(console.log);
    };

    onMounted(() => {
      windowShow();
    });

    return {
      platform: window.environment.platform,
      tk,
      toBilibili,
      toWin32,
      toWin32Set
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
}
</style>
