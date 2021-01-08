<template>
  <div class="head">
    <div class="title">
      标题
    </div>
    <div class="events">
      <div v-if="isMain" @click="min" class="event min no-drag cursor-pointer"></div>
      <div v-if="isMain" @click="maxMin" class="event maxmin no-drag cursor-pointer"></div>
      <div @click="close" class="event close no-drag cursor-pointer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {argsState} from "@/renderer/store";
import {minWindow, maxMinWindow, closeWindow} from "@/renderer/utils";

export default defineComponent({
  name: "Head",
  setup() {
    const args = argsState();
    const isMain = args.isMainWin || false;

    function min() {
      minWindow();
    }

    function maxMin() {
      maxMinWindow();
    }

    function close() {
      if (isMain) closeWindow();
      else closeWindow(args.id);
    }

    return {min, maxMin, close, isMain}
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
      margin-left: 10px;
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

    .min {
      background-color: var(--grey);
    }

    .maxmin {
      background-color: var(--cyan);
    }
  }
}
</style>
