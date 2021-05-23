<template>
  <div class="container">
    <Head />
    <div class="info">
      <h5>This is an about page</h5>
      <button @click="toHome">首页</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Head from '../components/Head.vue';
import { windowCreate, windowShow } from '@/renderer/utils/window';
import { argsData } from '@/renderer/store';

export default defineComponent({
  components: {
    Head
  },
  name: 'About',
  setup() {
    function toHome() {
      windowCreate({
        isMainWin: true,
        resizable: true
      });
    }

    onMounted(() => {
      windowShow(argsData.window.id);
    });

    return {
      toHome
    };
  }
});
</script>

<style lang="scss" scoped>
.info {
  width: 100%;
  height: 100%;
  padding: 25px 10px 10px;
}
</style>
