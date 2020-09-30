<script>
    import {ipcRenderer, remote} from 'electron';
    import {push, pop, replace} from 'svelte-spa-router';
    import {onMount} from 'svelte';
    import User from '../store/user';
    import Info from "./Info.svelte";
    import Head from "../components/Head.svelte";

    console.log('home')
    let date;
    onMount(() => {
        console.log('home onMount')
        date = new Date();
        setInterval(() => {
            date = new Date();
        }, 1000);
        console.log(User.get())
        User.set(1)
    })

</script>

<main>
    <Head/>
    <div class="title">Hello {remote.app.name}!!</div>
    <div>{date}</div>
    <button class="no-drag cursor-pointer" on:click={()=>replace('/Info/3')}>详情</button>
</main>

<style>
    .title {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 2.5em;
        font-weight: 100;
    }
</style>
