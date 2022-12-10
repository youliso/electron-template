import type { Routes } from '@youliso/granule/types/Router';

const routes: Routes = {
  webview: {
    component: () => import('@/renderer/views/components/webview')
  },
  home: {
    component: () => import('@/renderer/views/pages/home')
  },
  about: {
    component: () => import('@/renderer/views/pages/about')
  },
  music: {
    component: () => import('@/renderer/views/pages/music')
  }
};

export default routes;
