'use strict';
const {remote, ipcRenderer} = require('electron');
const _ = require('./api/util');
const doc = document;
const closed = doc.getElementById('close');
const mini = doc.getElementById('mini');
const setting = doc.getElementById('setting');
const content = doc.getElementById('content');

//模板
const Template = {
    home: {
        View: (app) => {
            return `
           <div class="content-head drag">${app.getName()} ${app.getVersion()}</div>
           <div class="content-cont">
                Electron_Template
           </div>
           `;
        },
        Event: (obj) => {
            //function
        }
    }
};

//模板加载
const Load_template = (name, V, E) => {
    content.innerHTML = Template[name].View(V);
    Template[name].Event(E);
};

module.exports = {
    //初始化
    Init: () => {
        //基础事件
        closed.addEventListener('click', () => {
            ipcRenderer.send('closed');
        });
        mini.addEventListener('click', () => {
            ipcRenderer.send('mini');
        });
        setting.addEventListener('click', () => {
            console.log('close');
        });
        //首页加载
        Load_template('home', remote.app, "test1")
    }
};
