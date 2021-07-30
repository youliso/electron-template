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
      <div v-if='eventShow' class="events">
        <div @click="min" class="event min no-drag"></div>
        <div @click="maxMin" class="event max-min no-drag"></div>
        <div @click="close" class="event close no-drag"></div>
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
  props: {
    eventShow: { // 仅 linux win 生效
      type: Boolean,
      default: true
    }
  },
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
@import './scss/index';
</style>
