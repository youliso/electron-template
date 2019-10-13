'use strict';
const {ipcRenderer} = require('electron');
const doc = document;
/*按钮*/
const close = doc.getElementById('close');
const mini = doc.getElementById('mini');
const setting = doc.getElementById('setting');
/*显示*/
const content = doc.getElementById('content');
//关闭
close.addEventListener('click', () => {
    ipcRenderer.send('closed');
});
//最小化
mini.addEventListener('click', () => {
    ipcRenderer.send('mini');
});
//设置
setting.addEventListener('click', () => {
    console.log('close');
});

module.exports ={
    content
};
