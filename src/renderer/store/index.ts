import { reactive, provide, inject } from 'vue';
import { WindowOpt } from '@/lib/interface';

/**
 * 组件页面配置
 * */
export const keepAliveData = reactive<{
  include: string[];
  exclude: string[];
  max: number;
}>({
  include: ['About'],
  exclude: [],
  max: 10
});
export const addInclude = (key: string) => {
  if (keepAliveData.include.indexOf(key) === -1) keepAliveData.include.push(key);
};
export const delInclude = (key: string) => {
  if (keepAliveData.include.indexOf(key) > -1)
    keepAliveData.include.splice(keepAliveData.include.indexOf(key), 1);
};
export const addExclude = (key: string) => {
  if (keepAliveData.exclude.indexOf(key) === -1) keepAliveData.exclude.push(key);
};
export const delExclude = (key: string) => {
  if (keepAliveData.exclude.indexOf(key) > -1)
    keepAliveData.exclude.splice(keepAliveData.exclude.indexOf(key), 1);
};

/**
 * 窗口常驻参数
 * */
export const argsData = reactive<{ window: WindowOpt }>({
  window: null
});

/**
 * 创建全局provide
 * @param key 唯一标识
 * @param args
 */
export const provideState = (key: string, args: { [key: string]: unknown }) =>
  provide(Symbol(key), reactive(args));
export const getProvideState = (key: string) => inject(Symbol(key));
