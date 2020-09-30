<script>
    import {ipcRenderer, remote} from 'electron';
    import {push, pop, replace} from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import User from '../store/user';

    console.log('home')
    let date;
    onMount(()=>{
        console.log('home onMount')
        date = new Date();
        setInterval(() => {
            date = new Date();
        }, 1000);
        console.log(User.get('count'))
        User.Info.count.set(1)
    })

</script>

<main>
    <div class="head">
        <i on:click={()=>ipcRenderer.send('closed')} class="cuIcon-close no-drag cursor-pointer"></i>
    </div>
    <div class="title">Hello {remote.app.name}!!</div>
    <div>{date}</div>
    <button class="no-drag cursor-pointer" on:click={()=>replace('/Info/3')}>详情</button>
</main>

<style>
    .head {
        height: 40px;
        padding: 0 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 20px;
    }

    .title {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 2.5em;
        font-weight: 100;
    }
</style>
