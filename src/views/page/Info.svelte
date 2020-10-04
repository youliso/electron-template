<script>
    import {push, pop, replace} from 'svelte-spa-router';
    import User from '../store/user';
    import Head from "../components/Head.svelte";

    export let params = {};
</script>
<main>
    <Head/>
    info {JSON.stringify(params)} User store {User.get()}
    <button class="no-drag cursor-pointer" on:click={()=>replace('/')}>返回</button>
</main>
