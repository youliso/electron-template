<template>
  <h1>{{ msg }}</h1>
  <img src="../assets/logo.png" />
  <button class="no-drag cursor-pointer" @click="count++">count is: {{ count }}</button>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  }
});
</script>
