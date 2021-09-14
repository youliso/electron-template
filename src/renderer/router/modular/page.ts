const Router: Route[] = [
  {
    path: '/home',
    component: () => import('@/renderer/views/pages/home/index')
  },
  {
    path: '/about',
    instance: true,
    component: () => import('@/renderer/views/pages/about/index')
  }
];

export default Router;
