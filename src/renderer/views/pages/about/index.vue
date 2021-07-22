<template>
  <div class="container">
    <Head />
    <div class="info">
      <img
        @click="open"
        src="https://avatars.githubusercontent.com/u/34784062?s=96&amp;v=4"
        width="68"
        height="68"
        alt="@youliso"
      />
      <div @click="open" class="name">youliso</div>
      <button @click="toHome">首页</button>
    </div>
  </div>
</template>

<script lang="ts">
import { BrowserWindowConstructorOptions } from 'electron';
import { defineComponent, onMounted } from 'vue';
import { windowCreate, windowShow } from '@/renderer/utils/window';
import { argsData } from '@/renderer/store';
import { openUrl } from '@/renderer/utils';
import Head from '@/renderer/views/components/head/index.vue';

export default defineComponent({
  components: {
    Head
  },
  name: 'About',
  setup() {
    function toHome() {
      let data: BrowserWindowConstructorOptions = {
        customize: {
          isMainWin: true,
          route: '/home'
        },
        resizable: true
      };
      windowCreate(data);
    }

    function open() {
      openUrl('https://github.com/youliso');
    }

    onMounted(() => {
      windowShow(argsData.window.id);
    });

    return {
      open,
      toHome
    };
  }
});
</script>

<style lang="scss" scoped>
@import './scss/index';
</style>
