<style lang="scss">
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

  > .win32, .darwin {
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

  > .win32 {
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

      > .setting {
        background-color: var(--cyan);
      }
    }
  }
}
</style>

<template>
  <div class="head-info drag">
    <div v-if="platform==='win32'" :class="platform">
      <div class="title">
        DEMO
      </div>
      <div class="events">
        <div @click="close" class="event close no-drag cursor-pointer"></div>
      </div>
    </div>
    <div v-else-if="platform==='darwin'" :class="platform">
      <div></div>
      <div class="title">
        DEMO
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {argsState} from "@/renderer/store";
import {isNull, getGlobal} from "@/lib";
import {closeWindow} from "@/renderer/utils";

export default defineComponent({
  name: "Head",
  setup() {
    const args = argsState();

    function close() {
      if (isNull(args)) closeWindow();
      else closeWindow(args.id);
    }

    return {
      close,
      platform: getGlobal("platform")
    }
  }
});
</script>