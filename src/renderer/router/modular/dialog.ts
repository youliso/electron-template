import { RouteRecordRaw } from 'vue-router';

const Route: RouteRecordRaw[] = [
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/renderer/views/dialog/message/index.vue')
  }
];

export default Route;
