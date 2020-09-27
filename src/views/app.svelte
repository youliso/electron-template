<script>
    import {ipcRenderer,remote} from 'electron';
    import './css/main.css';
</script>

<main>
    <div>Hello {remote.app.name}!!</div>
</main>

<style>
    div {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
</style>
