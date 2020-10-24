import {reactive, provide, inject} from "vue";

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
export const provideArgsState = (args?: WindowOpt) => provide(
    argsSymbol,
    createArgs(args)
);

/**
 * 窗口通信消息内容
 * */
export const messageData = reactive(<{ [key: string]: unknown }>{});
export const addMessageData = (key: string, value: unknown) => {
    messageData[key] = value;
};
export const delMessageData = (key: string) => {
    delete messageData[key];
};

