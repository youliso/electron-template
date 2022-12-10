import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import { Router } from '@youliso/granule';
import { windowUpdate } from '@youliso/electron-modules/renderer/window';

const router = new Router('hash', {
  '/': {
    component: () => import('@/renderer/views'),
    children: Object.assign(pageRoute, dialogRoute)
  }
});

router.onAfterRoute = (path) => {
  windowUpdate(path);
};

export default router;
