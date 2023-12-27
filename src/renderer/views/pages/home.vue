<template>
  <Head />
  <div class="container">
    <div class="info">hello</div>
    <div class="btns">
      <button @click="tk">弹框</button>
      <button @click="toBilibili">bilibili</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { windowCreate, windowMessageOn, windowShow } from '@youliso/electronic/ipc';

export default defineComponent({
  setup() {
    //监听弹框消息
    windowMessageOn('test', (_, args: any) => {
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
          titleBarStyle: 'hidden',
          frame: false,
          show: false,
          modal: true,
          resizable: true
        }
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

    onMounted(() => {
      windowShow();
    });

    return { tk, toBilibili };
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 32px 10px 10px;
}
</style>
