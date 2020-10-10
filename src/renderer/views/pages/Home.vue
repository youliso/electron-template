<template>
  <div class="main">
    <Head></Head>
    <router-link class="no-drag" to="/about">手机</router-link>
    <button class="no-drag" @click="test">弹个框</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Ipc from '../../utils/ipc';
import Head from '../components/Head.vue';

export default defineComponent({
  components: {
    Head
  },
  name: 'Home',
  setup(){
    Ipc.setBounds([700, 300]);
    const test = () =>{
      let data: DialogOpt = {
        route: '/Message',
        data: {text: "key不能为空"},
      };
      Ipc.dialogInit(data);
    }
    return {test}
  }
});
</script>

<style scoped>

</style>