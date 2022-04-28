import { createStore } from 'ym-web';

export const headStore = createStore(
  {
    setTitle: (title: string) => ({ title }),
    setShow: (show: boolean) => ({ show })
  },
  { title: window.customize.title, show: true }
);
