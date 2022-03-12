import { h } from '@/renderer/common/h';
import { proxy } from '@/renderer/common/proxy';

export function useState<T, K extends keyof HTMLElementTagNameMap>(
  str: T,
  tagName: K | 'span' = 'span',
  className?: string
): [ProxyValue<T>, HTMLElementTagNameMap[K]] {
  const view = h(
    tagName,
    { class: className },
    str as unknown as ComponentChild
  ) as HTMLElementTagNameMap[K];
  const data = proxy(str, (value) => (view.textContent = value));
  return [data, view];
}
