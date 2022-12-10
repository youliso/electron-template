import type { Routes } from '@youliso/granule/types/Router';

const routes: Routes = {
  message: {
    component: () => import('@/renderer/views/dialog/message/index')
  }
};

export default routes;
