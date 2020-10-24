<template>
  <div class="head">
    <div class="title">
      标题
    </div>
    <div class="events">
      <div @click="close" class="event close no-drag cursor-pointer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {argsState} from "../../store";
import {isNull} from "../../utils/tool";
import {closeWindow} from "../../utils/ipc";

export default defineComponent({
  name: "Head",
  setup() {
    const args = argsState();
    const close = () => {
      if (isNull(args)) closeWindow();
      else closeWindow(args.id);
    }
    return {close}
  }
});
</script>

<style lang="scss">
.head {
  position: absolute;
  top: 4px;
  left: 5px;
  right: 5px;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font: bolder 13px sans-serif;

    span {
      margin-left: 4px;
    }
  }

  .events {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .event {
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      width: 15px;
      height: 15px;
      margin-left: 4px;
    }

    .event:hover {
      opacity: .9;
    }

    .event:active {
      opacity: .7;
    }

    .close {
      background-color: var(--red);
    }

    .setting {
      background-color: var(--cyan);
    }
  }
}
</style>
