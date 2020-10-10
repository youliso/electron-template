<template>
  <div class="head">
    <span @click="close" class="no-drag cursor-pointer">x</span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ipcRenderer} from "electron";
import {argsState} from "../../store";
import Tool from '../../utils/tool';

export default defineComponent({
  name: 'Head',
  setup() {
    let args = argsState();
    const close = () => {
      console.log(args)
      if (Tool.isNull(args)) ipcRenderer.send("closed");
      else ipcRenderer.send("dialog-closed", args.key);
    }
    return {close}
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
