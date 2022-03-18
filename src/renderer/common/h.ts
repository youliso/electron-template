/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * License: MIT
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/tsx-dom
 */

function applyChild(element: JSX.Element, child: ComponentChild) {
  if (
    child instanceof HTMLElement ||
    child instanceof SVGElement ||
    child instanceof DocumentFragment
  )
    element.appendChild(child);
  else if (typeof child === 'string' || typeof child === 'number')
    element.appendChild(document.createTextNode(child.toString()));
  else console.warn('Unknown type to append: ', child);
}

function applyChildren(element: JSX.Element, children: ComponentChild[]) {
  for (const child of children) {
    if (!child && child !== 0) continue;

    if (Array.isArray(child)) applyChildren(element, child);
    else applyChild(element, child);
  }
}

function transferKnownProperties(source: any, target: any) {
  for (const key of Object.keys(source)) {
    if (Object.prototype.hasOwnProperty.call(target, key)) target[key] = source[key];
  }
}

export function h(
  tag: string | ComponentFactory,
  attrs: null | ComponentAttributes,
  ...children: ComponentChild[]
): JSX.Element {
  if (typeof tag === 'function') return tag({ ...attrs, children });

  let element: JSX.Element;
  if (attrs?.xmlns) {
    element = document.createElementNS(attrs.xmlns as string, tag) as SVGElement;
  } else element = document.createElement(tag);

  if (attrs) {
    // Special handler for style with a value of type JSX.StyleAttributes
    if (attrs.style && typeof attrs.style !== 'string') {
      transferKnownProperties(attrs.style, element.style);
      delete attrs.style;
    }

    for (const name of Object.keys(attrs)) {
      const value = attrs[name];
      if (name === 'dangerouslySetInnerHTML' && typeof value === 'string') {
        element.innerHTML = value;
      } else if (name.startsWith('on')) {
        const finalName = name.replace(/Capture$/, '');
        const useCapture = name !== finalName;
        const eventName = finalName.toLowerCase().substring(2);
        element.addEventListener(
          eventName,
          value as EventListenerOrEventListenerObject,
          useCapture
        );
      } else if (value === true) element.setAttribute(name, name);
      else if (value || value === 0) element.setAttribute(name, value.toString());
    }
  }

  applyChildren(element, children);
  return element;
}

export function f({ children }: { children: Node[] | null }) {
  const element = document.createDocumentFragment();
  children && children.forEach((node) => element.appendChild(node));
  return element;
}

export function renderView(
  cache: boolean,
  parentEl: HTMLElement,
  view: View,
  query?: any,
  params?: any
) {
  if (!cache && view.onLoad) view.onLoad(query, params);
  else if (cache && view.onActivated) view.onActivated(query, params);
  if (view.$el) {
    parentEl.appendChild(view.$el);
    return;
  }
  const viewEl = h('div', { class: 'container' });
  if (view.render) {
    const cl = view.render();
    if (cl) {
      if (Array.isArray(cl)) for (const v of cl) viewEl.appendChild(v);
      else viewEl.appendChild(cl);
    }
  }
  view.$el = viewEl;
  parentEl.appendChild(viewEl);
  !cache && view.onReady && view.onReady();
}

export function unView(cache: boolean, view: View) {
  if (cache) view.onDeactivated && view.onDeactivated();
  else view.onUnmounted && view.onUnmounted();
  view.$el && view.$el.parentNode?.removeChild(view.$el as HTMLElement);
}
