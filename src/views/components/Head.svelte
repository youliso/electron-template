<script>
    import {ipcRenderer} from 'electron';
    import {location, querystring} from 'svelte-spa-router';
</script>

<div class="head">
    <div class="title">
        {$location} - {$querystring}
    </div>
    <div>
        <i on:click={()=>ipcRenderer.send('closed')} class="cuIcon-close no-drag cursor-pointer"></i>
    </div>
</div>

<style lang="scss">
  .head {
    height: 40px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
  }
</style>
