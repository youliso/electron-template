// @ts-ignore
import {wrap} from 'svelte-spa-router/wrap'

export const routes = {
    '/': wrap({
        asyncComponent: () => import('./page/Home.svelte')
    }),
    '/Info/:id?': wrap({
        asyncComponent: () => import('./page/Info.svelte')
    })
}
