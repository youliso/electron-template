import {reactive} from 'vue';

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