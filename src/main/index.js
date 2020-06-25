'use strict';
const main = require('./lib/main');
(async () => {
    await main.init(); //初始化
    await main.ipc(); //开启ipc通讯
})()


