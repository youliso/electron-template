<script>
    import {push, pop, replace} from 'svelte-spa-router';
    import User from '../store/user';
    export let params = {};
</script>
<main>
    info {JSON.stringify(params)} User store {User.get('count')}
    <button class="no-drag cursor-pointer" on:click={()=>replace('/')}>返回</button>
</main>
