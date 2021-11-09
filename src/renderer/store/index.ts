import Store from '@/renderer/common/store';

export function setCustomize(args: Customize) {
  Store.set('customize', args);
}

export function getCustomize() {
  return Store.get<Customize>('customize');
}

export function testProxy(date: string, el: HTMLElement) {
  return Store.proxy(date, (value) => (el.textContent = value));
}
