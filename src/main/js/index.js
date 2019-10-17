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

//加载
const Load_template = (name, V, E) => {
    content.innerHTML = Template[name].View(V);
    Template[name].Event(E);
};

module.exports = {
    Init: () => {
        closed.addEventListener('click', () => {
            ipcRenderer.send('closed');
        });
        mini.addEventListener('click', () => {
            ipcRenderer.send('mini');
        });
        setting.addEventListener('click', () => {
            console.log('setting');
        });
        Load_template('home', remote.app, "test1")
    }
};
