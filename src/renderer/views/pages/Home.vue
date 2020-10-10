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
import {join, resolve} from 'path';
import Ipc from '../../utils/ipc';
import Head from '../components/Head.vue';

export default defineComponent({
  components: {
    Head
  },
  name: 'Home',
  data() {
    return {}
  },
  created() {
    Ipc.setBounds([700, 300]);
  },
  methods: {
    test() {
      let data: DialogOpt = {
        route: '/Message',
        data: {text: "key不能为空"},
      };
      Ipc.dialogInit(data);
    }
  }
});
</script>

<style scoped>

</style>