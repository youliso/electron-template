<template>
  <div class="main">
    <Head></Head>
    23131
    <router-link class="no-drag" to="/about">手机</router-link>
    <button class="no-drag" @click="test">弹个框</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Ipc from '../../lib/ipc';
import Head from '../../components/Head.vue';

export default defineComponent({
  components: {
    Head
  },
  name: 'Home',
  created() {
    Ipc.setBounds([600, 300]);
  },
  methods: {
    test() {
      Ipc.dialogInit({
        dialogName: "提示",
        uniQueKey: "Message",
        data: {text: "key不能为空"},
      })
    }
  }
});
</script>

<style scoped>

</style>