'use strict';
const {BrowserWindow, app} = require('electron').remote;
const request = require('request');
const fs = require('fs');
const util = {};
/**
 * 写入
 * */
util.WriteIn = (obj) => {
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
util.ReadFile = (obj) => {
    return new Promise((resolve, reject) => {
        fs.readFile(obj.url, obj.encoding || "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

/**
 * 检查路径是否存在 如果不存在则创建路径
 * @param {string} folderpath 文件路径
 */
util.checkDirExist = (folderpath) => {
    if (!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath);
    }
};
/**
 * 数据库创建
 * */
util.accessIn = (path) => {
    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');
    try {
        util.checkDirExist(path);
        const db = low(new FileSync(path + '/db.json'));
        return db.defaults({}).write();
    } catch (err) {
        console.log(err);
    }
};

/**
 * 创建新窗口
 * win.loadURL(modalPath)
 * win.show()
 * */
util.NewBrowserWindow = (obj) => {
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
util.GetHttp = (obj) => {
    return new Promise((resolve, reject) => {
        request({
            url: obj.url,
            method: obj.method || 'GET',
            json: obj.json || true,
            headers: obj.headers || {
                "content-type": "application/json",
            },
            body: obj.data
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) resolve(body);
            else reject(error)
        });
    });
};

module.exports = util;
