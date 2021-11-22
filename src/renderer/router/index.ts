import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import Router from '@/renderer/common/router';
import { updateCustomizeRoute } from '@/renderer/store';

const Routers = new Router([...pageRoute, ...dialogRoute]);

Routers.onRoute = (route) => {
  updateCustomizeRoute(route.path);
};

export function routerInit(route: string) {
  Routers.push(route);
}

export default Routers;
