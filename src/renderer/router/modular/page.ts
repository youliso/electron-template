const Router: Route[] = [
  {
    path: '/home',
    name: 'Index',
    component: () => import('@/renderer/views/pages/home/index')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/renderer/views/pages/about/index')
  }
];

export default Router;
