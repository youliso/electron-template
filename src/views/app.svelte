<script>
    import {ipcRenderer,remote} from 'electron';
    import './css/main.css';
</script>

<main>
    <h1>Hello {remote.app.name}!!</h1>
</main>

<style>
    main {
        background: #333333;
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
