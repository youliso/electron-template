import {reactive, provide, inject} from "vue";
import {WindowOpt} from "@/lib/interface";

/**
 * 组件页面配置
 * */
export const keepAliveOpt = reactive({
    include: ["About"],
    exclude: [],
    max: 10
});
export const addInclude = (key: string) => {
    if (keepAliveOpt.include.indexOf(key) === -1) keepAliveOpt.include.push(key);
};
export const delInclude = (key: string) => {
    if (keepAliveOpt.include.indexOf(key) > -1) keepAliveOpt.include.splice(keepAliveOpt.include.indexOf(key), 1);
};
export const addExclude = (key: string) => {
    if (keepAliveOpt.exclude.indexOf(key) === -1) keepAliveOpt.exclude.push(key);
};
export const delExclude = (key: string) => {
    if (keepAliveOpt.exclude.indexOf(key) > -1) keepAliveOpt.exclude.splice(keepAliveOpt.exclude.indexOf(key), 1);
};

/**
 * 窗口初始化参数
 * */
export const argsSymbol = Symbol("args");
export const createArgs = (args?: WindowOpt) => reactive(args);
export const argsState = (): WindowOpt => inject(argsSymbol);

/**
 * 创建全局provide
 * @param key 唯一标识
 * @param args
 */
export const provideState = (key: symbol, args: { [key: string]: unknown }) => provide(
    key,
    reactive(args)
);
export const getProvideState = (key: symbol) => inject(key);

/**
 * 窗口通信消息内容
 * */
export const messageData = reactive(<{ [key: string]: unknown }>{});
export const setMessageData = (key: string, value: unknown) => {
    messageData[key] = value;
};
export const removeMessageData = (key: string) => {
    delete messageData[key];
};

