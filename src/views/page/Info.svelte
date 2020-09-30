<script>
    import {push, pop, replace} from 'svelte-spa-router';
    export let params = {};
</script>
<main>
    info {JSON.stringify(params)}
    <button class="no-drag cursor-pointer" on:click={()=>push('/')}>返回</button>
</main>
