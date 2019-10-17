'use strict';
const {BrowserWindow} = require('electron').remote;
const request = require('request');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({}).write();

/**
 * 写入
 * */
const WriteIn = (obj) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(obj.url, JSON.stringify(obj.data), (err) => {
            if (err) reject(err);
            resolve(obj.data);
        });
    });
};

/**
 * 读取
 * */
const ReadFile = (obj) => {
    return new Promise((resolve, reject) => {
        fs.readFile(obj.url, obj.encoding || "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

/**
 * 创建新窗口
 * win.loadURL(modalPath)
 * win.show()
 * */
const NewBrowserWindow = (obj) => {
    let win = new BrowserWindow({
        width: obj.width,
        height: obj.height,
        minWidth: obj.minWidth,
        minHeight: obj.minHeight,
        maxWidth: obj.maxWidth,
        maxHeight: obj.maxHeight,
        transparent: true,
        autoHideMenuBar: true,
        resizable: false,
        maximizable: false,
        frame: false,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            webSecurity: false
        }
    });
    win.on('resize', obj.resize || null);
    win.on('move', obj.move || null);
    win.on('close', () => win = null);
    win.loadURL(obj.path);
    win.show();
    return win;
};

/**
 * 请求
 * */
const GetHttp = (obj) => {
    return new Promise((resolve, reject) => {
        request({
            url: obj.url,
            method: obj.method || 'GET',
            json: obj.json || true,
            headers: obj.headers || {
                "content-type": "application/json",
            },
            body: obj.data
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) resolve(body);
            else reject(error)
        });
    });
};


module.exports = {
    WriteIn,
    ReadFile,
    GetHttp
};
