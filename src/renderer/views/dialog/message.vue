<template>
  <Head />
  <div class="container">
    <div class="text">
      <div>创建传参: {{ data.text }}</div>
      <div>app启动参数: {{ argv }}</div>
    </div>
    <button @click="test">测试通讯</button>
    <button @click="test1">测试获取路由id {{ winId }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { windowShow, windowIdGet, windowMessageSend } from '@youliso/electronic/ipc';

export default defineComponent({
  setup() {
    let cons = 0;

    const test = () => {
      //测试发送窗口消息
      windowMessageSend('test', {
        value: cons++
      });
    };

    let winId = ref();

    const test1 = async () => {
      winId.value = await windowIdGet();
    };

    onMounted(() => {
      windowShow();
    });

    return {
      argv: window.customize.argv,
      data: window.customize.data,
      winId,
      test,
      test1
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 32px 10px 10px;
}
</style>
