<template>
  <div class="container">
    <Head />
    <div class="info">
      <div class="text">
        <div>创建传参: {{ data.text }}</div>
        <div>app启动参数: {{ argv }}</div>
      </div>
      <button @click="test">测试通讯</button>
      <button @click="test1">测试获取路由id</button>
      <button class="close" @click="close">确定</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { argsData } from '@/renderer/store';
import { getGlobal } from '@/renderer/utils';
import {
  windowClose,
  windowSetSize,
  windowShow,
  windowStatus,
  windowIdGet,
  windowMessageSend
} from '@/renderer/utils/window';
import Head from '@/renderer/views/components/head/index.vue';

export default defineComponent({
  components: {
    Head
  },
  name: 'Message',
  setup() {
    const argv = getGlobal('app.argv');
    let cons = 0;
    windowSetSize(argsData.window.id, [400, 200], true, argsData.window.currentMaximized);

    function test() {
      //测试发送窗口发送消息
      windowMessageSend('test', {
        value: cons++
      });
    }

    function test1() {
      console.log(windowIdGet());
    }

    function close() {
      windowClose(argsData.window.id);
    }

    onMounted(() => {
      windowShow(argsData.window.id);
      windowStatus(argsData.window.id, 'isModal').then(console.log); //当前窗口是否Modal
    });

    return {
      data: argsData.window.data,
      test,
      argv,
      close,
      test1
    };
  }
});
</script>

<style lang="scss" scoped>
@import './scss/index';
</style>
