<template>
  <div class="main">
    <Head></Head>
    {{args.data}}
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {argsState} from "../../store";
import Ipc from '../../utils/ipc';
import Head from '../components/Head.vue';

export default defineComponent({
  components: {
    Head
  },
  name: "Message",
  setup() {
    Ipc.setBounds([400, 150]);
    return {args:argsState()};
  }
});
</script>

<style scoped>

</style>