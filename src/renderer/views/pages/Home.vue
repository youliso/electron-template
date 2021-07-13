<template>
  <div class="container">
    <Head></Head>
    <div class="info">
      <div>hello {{ version }}</div>
      <button @click="toAbout">关于</button>
      <button @click="test">弹个框</button>
    </div>
  </div>
</template>

<script lang="ts">
import { IpcRendererEvent, BrowserWindowConstructorOptions } from 'electron';
import { defineComponent, onMounted, onUnmounted } from 'vue';
import Head from '../components/Head.vue';
import { argsData } from '@/renderer/store';
import {
  windowCreate,
  windowShow,
  windowMessageOn,
  windowMessageRemove
} from '@/renderer/utils/window';
import { getGlobal } from '@/renderer/utils';
import { useRouter } from 'vue-router';
export default defineComponent({
  components: {
    Head
  },
  name: 'Home',
  setup() {
    const router = useRouter();
    windowMessageOn('test', (event: IpcRendererEvent, args: any) => {
      //监听弹框测试
      console.log(args);
    });

    function test() {
      let data: BrowserWindowConstructorOptions = {
        customize: {
          title: '弹框测试',
          route: '/message',
          parentId: argsData.window.id,
          data: { text: '123' }
        },
        modal: true,
        resizable: true
      };
      windowCreate(data);
    }

    function toAbout() {
      router.replace('/about');
      return;
      let data: BrowserWindowConstructorOptions = {
        customize: {
          route: '/about',
          isMainWin: true
        },
        width: 300,
        height: 300,
        resizable: true
      };
      windowCreate(data);
    }

    onMounted(() => {
      windowShow(argsData.window.id);
    });

    onUnmounted(() => {
      windowMessageRemove('test'); //关闭监听
    });

    return {
      test,
      toAbout,
      version: getGlobal('app.version')
    };
  }
});
</script>

<style lang="scss" scoped>
.info {
  width: 100%;
  height: 100%;
  padding: 30px 10px 10px;
}
</style>
