import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import Router from '@/renderer/common/router';
import { updateCustomizeRoute } from '@/renderer/store';

const router = new Router([...pageRoute, ...dialogRoute]);

router.onBeforeRoute = (route) => {
  console.log('onBeforeRoute', router.current?.$path, route.path);
  updateCustomizeRoute(route.path);
  return true;
};

router.onAfterRoute = (route) => {
  console.log('onAfterRoute');
};

export function routerInit(route: string) {
  router.push(route);
}

export default router;
