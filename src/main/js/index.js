'use strict';
const {remote, ipcRenderer} = require('electron');
const _ = require('./api/util');
const doc = document;
const closed = doc.getElementById('close');
const mini = doc.getElementById('mini');
const setting = doc.getElementById('setting');
const content = doc.getElementById('content');

//模板
class Template {
    constructor(obj) {
        obj.view.innerHTML = eval(this[obj.name]).View(obj.data.v);
        eval(this[obj.name]).Event(obj.data.e);
    }

    home = {
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
}

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
        new Template({view: content, name: 'home', data: {v: remote.app, e: 'test'}});
    }
};
