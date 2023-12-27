<template>
  <div v-if="platform === 'darwin'" class="head-info drag">
    <div></div>
    <div class="title">
      {{ title }}
    </div>
  </div>
  <div v-else class="head-info drag">
    <div class="title">
      {{ title }}
    </div>
    <div class="events">
      <div @click="min" class="event min no-drag cursor-pointer"></div>
      <div @click="maxMin" class="event maxmin no-drag cursor-pointer"></div>
      <div @click="close" class="event close no-drag cursor-pointer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { windowClose, windowMaxMin, windowMin } from '@youliso/electronic/ipc/window';

export default defineComponent({
  name: 'Head',
  setup() {
    function min() {
      windowMin();
    }

    function maxMin() {
      windowMaxMin();
    }

    function close() {
      windowClose();
    }

    return {
      min,
      maxMin,
      close,
      title: window.customize.title,
      platform: window.environment.platform
    };
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
  justify-content: center;
  align-items: center;
  > .title {
    padding-left: 10px;
    font-size: 13px;
    width: 70%;
  }

  > .events {
    padding-right: 10px;
    width: 30%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    > .event {
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      width: 15px;
      height: 15px;
      margin-left: 6px;
    }

    > .event:hover {
      opacity: 0.9;
    }

    > .event:active {
      opacity: 0.7;
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
</style>
