import Router from '@/renderer/router';
import Store from '@/renderer/store';
import Dom from '@/renderer/common/dom';
import Head from '@/renderer/views/components/head';

export default function () {
  const args = Store.get<Customize>('customize');
  Dom.init('app', 'container');
  if (args.isHead) Dom.setComponent(Head());
  Router.replace(args.route);
}
