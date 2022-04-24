import { preloadDefaultInit } from 'ym-electron/preload';
import { isSecondInstanceWin } from '@/cfg/app.json';

preloadDefaultInit({
  isSecondInstanceWin
});
