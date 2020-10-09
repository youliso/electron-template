<template>
  <div class="main">
    <div class="about">
      <h1>This is an about page</h1>
    </div>
    <HelloWorld></HelloWorld>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import HelloWorld from '../../components/HelloWorld.vue';

export default defineComponent({
  components:{
    HelloWorld
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
.about{
  h1{
    padding: 20px;
  }
}
</style>