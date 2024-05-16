<template>
  <div class="container">
    <div class="info">hello</div>
    <div class="info">extern:{{ path['extern'] }}</div>
    <div class="info">inside:{{ path['inside'] }}</div>
    <div class="info">platform:{{ path['platform'] }}</div>
    <div class="info">root:{{ path['root'] }}</div>
    <div class="btns">
      <button @click="tk">弹框</button>
      <button @click="toBilibili">bilibili</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
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

    const path = ref<{ [key: string]: string }>({});
    const pathGet = async () => {
      ['platform', 'inside', 'extern', 'root'].forEach(async (e) => {
        path.value[e] = await window.resources.pathGet(e as any);
      });
    };

    onMounted(() => {
      windowShow();
      pathGet();
    });

    return {
      path,
      platform: window.environment.platform,
      tk,
      toBilibili
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
}
</style>
