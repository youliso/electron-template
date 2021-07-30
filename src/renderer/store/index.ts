import { reactive } from 'vue';

/**
 * 组件页面配置
 * */
export const keepAliveData = reactive<{
  include: string[];
  exclude: string[];
  max: number;
}>({
  include: [],
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
export const argsData = reactive<{ window: Customize }>({
  window: null
});
