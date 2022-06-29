import type { Route } from '@youliso/web-modules/types';
import webview from '@/renderer/views/components/webview/index';
import home from '@/renderer/views/pages/home/index';

const Router: Route[] = [
  {
    path: '/Webview',
    component: webview
  },
  {
    path: '/home',
    component: home
  },
  {
    path: '/about',
    component: () => import('@/renderer/views/pages/about/index')
  },
  {
    path: '/music',
    instance: true,
    component: () => import('@/renderer/views/pages/music/index')
  }
];

export default Router;
