import { preloadInit } from 'ym-electron/preload';
import { isSecondInstanceWin } from '@/cfg/app.json';

preloadInit(isSecondInstanceWin);
