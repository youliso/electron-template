import { createStore } from '@/renderer/common/store';

export const titleStore = createStore(
  {
    set: (title: string) => ({ title })
  },
  { title: window.customize.title }
);
