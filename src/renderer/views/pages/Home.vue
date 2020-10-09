<template>
  <div class="main">
    23131
    <router-link class="no-drag" to="/about">手机</router-link>
    <button class="no-drag" @click="test">弹个框</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Home',
  created() {
    this.$Ipc.setBounds([600, 300]);
  },
  methods: {
    test() {
      this.$Ipc.dialogInit({
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