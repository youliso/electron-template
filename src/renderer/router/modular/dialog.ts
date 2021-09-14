const Router: Route[] = [
  {
    path: '/message',
    component: () => import('@/renderer/views/dialog/message/index')
  }
];

export default Router;
