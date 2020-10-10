import {reactive, provide, inject} from 'vue';

export const argsSymbol = Symbol('args');
export const createArgs = (args?: DialogOpt) => reactive(args);
export const argsState = (): DialogOpt => inject(argsSymbol);
export const provideArgsState = (args?: DialogOpt) => provide(
    argsSymbol,
    createArgs(args)
);
