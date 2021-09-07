const Router: Route[] = [
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/renderer/views/dialog/message/index')
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/renderer/views/dialog/demo/index')
  }
];

export default Router;
