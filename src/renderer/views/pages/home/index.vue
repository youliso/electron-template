<template>
  <div class='container'>
    <Head />
    <div :ref='elDom' class='info'>
      <div>hello {{ version }}</div>
      <button @click='toAbout'>关于</button>
      <button @click='test'>弹个框</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { IpcRendererEvent, BrowserWindowConstructorOptions } from 'electron';
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { argsData } from '@/renderer/store';
import {
  windowCreate,
  windowShow,
  windowMessageOn,
  windowMessageRemove
} from '@/renderer/utils/window';
import { getGlobal } from '@/renderer/utils';
import { menuShow, menuOn, menuListenersRemove } from '@/renderer/utils/menu';
import Head from '@/renderer/views/components/head/index.vue';

export default defineComponent({
  components: {
    Head
  },
  name: 'Home',
  setup() {
    function elDom(element: HTMLElement) {
      if (!element) return;
      element.oncontextmenu = () => {
        menuShow();
      };
    }

    menuOn((event, args) => {
      console.log(args);
    });

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
      menuListenersRemove();
    });

    return {
      elDom,
      test,
      toAbout,
      version: getGlobal('app.version')
    };
  }
});
</script>

<style lang='scss' scoped>
@import './scss/index';
</style>
