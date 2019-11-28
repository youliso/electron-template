'use strict';
const fs = require('fs');
const config = require('../cfg/config');
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
util.NewBrowserWindow = (BrowserWindow, obj) => {
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
 * 对象转url参数
 * */
util.convertObj = (data) => {
    let _result = [];
    for (let key in data) {
        let value = data[key];
        if (value.constructor == Array) {
            value.forEach(function (_value) {
                _result.push(key + "=" + _value);
            });
        } else {
            _result.push(key + '=' + value);
        }
    }
    return _result.join('&');
};

/**
 * fetch
 * */
util.fetch = (url, param, is) => {
    let data = {
        headers: {'Content-type': 'application/json'}
    };
    if (param) {
        data.method = param.method || 'GET';
        if (data.method == 'GET') url = url + util.convertObj(param.data);
        else data.body = JSON.stringify(param.data);
    }
    if (is) url = config.url + url;
    return new Promise((resolve, reject) => {
        fetch(url, data)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    });
};

module.exports = util;
