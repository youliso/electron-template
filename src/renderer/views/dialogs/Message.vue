<template>
  Message
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "Message",
  created() {
    this.$Ipc.setBounds([400, 150]);
  }
});
</script>

<style scoped>

</style>