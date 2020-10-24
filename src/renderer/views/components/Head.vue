<template>
  <div class="head">
    <span @click="close" class="no-drag cursor-pointer">x</span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ipcRenderer} from "electron";
import {argsState} from "../../store";
import {isNull} from "../../utils/tool";

export default defineComponent({
  name: "Head",
  setup() {
    const args = argsState();
    const close = () => {
      if (isNull(args)) ipcRenderer.send("closed");
      else ipcRenderer.send("closed", args.id);
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
