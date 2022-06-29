import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import { Router } from '@youliso/web-modules';
import { windowUpdate } from '@youliso/electron-modules/renderer/window';

const router = new Router('inner', [...pageRoute, ...dialogRoute]);

router.onBeforeRoute = (route) => {
  windowUpdate(route.path);
  return true;
};

router.onAfterRoute = (route) => {};

export default router;
