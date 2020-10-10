<template>
  <div class="head">
    <span @click="close" class="no-drag cursor-pointer">x</span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ipcRenderer} from "electron";
import Tool from '../lib/tool';

export default defineComponent({
  name: 'Head',
  methods: {
    close() {
      if (Tool.isNull(this.$Args)) ipcRenderer.send("closed");
      else ipcRenderer.send("dialog-closed", this.$Args.key);
    }
  }
});
</script>

<style lang="scss">
.head {
  position: absolute;
  top: 5px;
  right: 5px;

  span {
    margin-left: 4px;
  }
}

</style>
