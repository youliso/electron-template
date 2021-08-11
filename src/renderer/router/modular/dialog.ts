const Router: Route[] = [
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/renderer/views/dialog/message/index')
  }
];

export default Router;
