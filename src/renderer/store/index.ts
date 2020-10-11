import {reactive, provide, inject} from 'vue';

/**
 * 组件页面
 * */
export const state = reactive({
    include: ['About'],
    exclude: [],
    keepAliveMax: 10
});

export const addInclude = (key: string) => {
    if (state.include.indexOf(key) === -1) state.include.push(key);
};

export const delInclude = (key: string) => {
    if (state.include.indexOf(key) > -1) state.include.splice(state.include.indexOf(key), 1);
};

export const addExclude = (key: string) => {
    if (state.exclude.indexOf(key) === -1) state.exclude.push(key);
};

export const delExclude = (key: string) => {
    if (state.exclude.indexOf(key) > -1) state.exclude.splice(state.exclude.indexOf(key), 1);
};

/**
 * 窗口初始化参数
 * */
export const argsSymbol = Symbol('args');
export const createArgs = (args?: DialogOpt) => reactive(args);
export const argsState = (): DialogOpt => inject(argsSymbol);
export const provideArgsState = (args?: DialogOpt) => provide(
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

