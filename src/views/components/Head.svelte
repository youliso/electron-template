<script>
    import {ipcRenderer} from 'electron';
</script>

<div class="head">
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
