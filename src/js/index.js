'use strict';
const {remote, ipcRenderer} = require('electron');
const _ = require('./api/util');
const doc = document;
const closed = doc.getElementById('close');
const mini = doc.getElementById('mini');
const setting = doc.getElementById('setting');
const content = doc.getElementById('content');

//页面模板加载
const Load_template = (name, V, E) => {
    content.innerHTML = View_Template[name](V);
    Event_Template[name](E);
};

//模板
const View_Template = {
    home: (app) => {
        return `
           <div class="content-head drag">${app.getName()} ${app.getVersion()}</div>
           <div class="content-cont">
             <button id="xieru">写入</button>
           </div>
           `;
    }
};

//模板对应方法
const Event_Template = {
    home: (obj) => {
        document.getElementById('xieru').addEventListener('click', () => {
            _.WriteIn(obj);
        })
    }
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
        Load_template('home', remote.app, "test")
    }
};
