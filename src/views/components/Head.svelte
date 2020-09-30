<script>
    import {ipcRenderer} from 'electron';
    import {location, querystring} from 'svelte-spa-router';
</script>

<div class="head">
    <div style="margin-right: 20px">
        {$location} - {$querystring}
    </div>
    <i on:click={()=>ipcRenderer.send('closed')} class="cuIcon-close no-drag cursor-pointer"></i>
</div>

<style>
    .head {
        height: 40px;
        padding: 0 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 20px;
    }
</style>
