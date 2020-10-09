<template>
  <div class="main">
    <Head></Head>
    {{$Args.data}}
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
  name: "Message",
  created() {
    Ipc.setBounds([400, 150]);
  }
});
</script>

<style scoped>

</style>