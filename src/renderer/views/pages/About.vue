<template>
  <div class="main">
    <Head></Head>
    <div class="about">
      <h1>This is an about page</h1>
    </div>
    <router-link class="no-drag" to="/">首页</router-link>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Head from '../../components/Head.vue';

export default defineComponent({
  components: {
    Head
  },
  name: 'About',
  created() {
  },
  activated() {
    console.log("activated")
  }
});
</script>

<style scoped lang="scss">
.about {
  h1 {
    padding: 20px;
  }
}
</style>