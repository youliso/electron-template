import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import { Router } from '@youliso/granule';
import { windowUpdate } from '@youliso/electronic/ipc/window';

const router = new Router('hash', {
  '/': {
    component: () => import('@/renderer/views/app'),
    children: Object.assign(pageRoute, dialogRoute)
  }
});

router.onAfterRoute = (path) => {
  windowUpdate(path);
};

export default router;
