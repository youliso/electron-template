<template>
  <div class="head-info drag">
    <div v-if="isMacintosh" class="content">
      <div></div>
      <div class="title">
        {{ title }}
      </div>
    </div>
    <div v-else class="content">
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
import { computed, defineComponent } from 'vue';
import { getGlobal } from '@/renderer/utils';
import { argsData } from '@/renderer/store';
import { windowClose, windowMaxMin, windowMin } from '@/renderer/utils/window';

export default defineComponent({
  name: 'Head',
  setup() {
    const isMacintosh = computed(() => getGlobal('system.platform') === 'darwin');

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
      title: argsData.window.title || getGlobal('app.name'),
      isMacintosh
    };
  }
});
</script>

<style lang="scss" scoped>
.darwin {
  .head-info > .content {
    padding-right: 10px;
  }
}

.win32,
.linux {
  .head-info > .content {
    padding-left: 10px;
  }
}

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

  > .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .title {
      font: normal 13px /13px ping-fang;
    }

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
}
</style>
