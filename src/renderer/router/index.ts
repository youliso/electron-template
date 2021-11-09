import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import Router from '@/renderer/common/router';

const Routers = new Router([...pageRoute, ...dialogRoute]);

export function routerInit(route: string) {
  Routers.push(route);
}

export default Routers;
