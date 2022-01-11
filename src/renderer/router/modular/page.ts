import home from '@/renderer/views/pages/home/index';

const Router: Route[] = [
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
  },
  {
    path: '/game',
    instance: true,
    component: () => import('@/renderer/views/pages/game/index')
  }
];

export default Router;
