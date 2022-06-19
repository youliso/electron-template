import type { Route } from 'ym-web/types';

const Router: Route[] = [
  {
    path: '/message',
    component: () => import('@/renderer/views/dialog/message/index')
  }
];

export default Router;
