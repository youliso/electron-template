import { createStore } from 'ym-web';

export const titleStore = createStore(
  {
    set: (title: string) => ({ title })
  },
  { title: window.customize.title }
);
