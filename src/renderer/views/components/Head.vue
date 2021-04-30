<template>
  <div class="head-info drag">
    <div v-if="platform==='darwin'" :class="platform">
      <div></div>
      <div class="title">
        {{ title }}
      </div>
    </div>
    <div v-else :class="platform">
      <div class="title">
        {{ title }}
      </div>
      <div class="events">
        <div @click="min" class="event min no-drag cursor-pointer"></div>
        <div @click="maxMin" class="event maxmin no-drag cursor-pointer"></div>
        <div @click="close" class="event close no-drag cursor-pointer"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {argsData} from "@/renderer/store";
import {windowClose, windowMaxMin, windowMin} from "@/renderer/utils/window";

export default defineComponent({
  name: "Head",
  setup() {

    function min() {
      windowMin(argsData.window.id);
    }

    function maxMin() {
      windowMaxMin(argsData.window.id);
    }

    function close() {
      windowClose(argsData.window.id);
    }

    return {
      min,
      maxMin,
      close,
      title: argsData.window.title || argsData.window.appInfo.name,
      platform: argsData.window.platform
    }
  }
});
</script>

<style lang="scss" scoped>
.head-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > .win32, .darwin, .linux {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .title {
      font: normal 13px /13px ping-fang;
    }
  }

  > .darwin {
    padding-right: 10px;
  }

  > .win32, .linux {
    padding-left: 10px;

    > .events {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 10px;

      > .event {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        width: 15px;
        height: 15px;
        margin-left: 4px;
      }

      > .event:hover {
        opacity: .9;
      }

      > .event:active {
        opacity: .7;
      }

      > .close {
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
}
</style>
