import Router from '@/renderer/router';
import Store from '@/renderer/store';

export default function () {
  const args = Store.get<Customize>('customize');
  Router.init('app', args.route);
}
