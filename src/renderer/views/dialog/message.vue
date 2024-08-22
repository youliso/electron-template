<template>
  <div class="container">
    <div>创建传参: {{ data.text }}</div>
    <div>窗口组ids: {{ winId }}</div>
    <button @click="test">测试通讯</button>
    <button @click="test1">测试获取窗口组ids</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { windowShow, windowIdGet, windowMessageSend, windowSingleDataOn, windowFunc } from '@youliso/electronic/ipc';

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

    windowSingleDataOn(() => {
      windowFunc('focus');
    })

    onMounted(() => {
      windowShow();
    });

    return {
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
  padding: 10px;
}
</style>
