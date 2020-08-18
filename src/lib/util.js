'use strict';
const {existsSync, readdirSync, statSync, unlinkSync, rmdirSync, mkdirSync, writeFileSync, appendFileSync} = require('fs');
const {resolve} = require('path');
const {ipcRenderer, remote} = require('electron');
const main = require('./main');

class util {
    static getInstance() {
        if (!util.instance) util.instance = new util();
        return util.instance;
    }

    constructor() {
        this.logFile = resolve("./log");
        this.ipcRenderer = ipcRenderer;
        this.remote = remote;
        try {
            statSync(this.logFile);
        } catch (e) {
            mkdirSync(this.logFile, {recursive: true});
        }
    }

    /**
     * 日志输出
     * */
    log() {
        let that = this;
        return {
            info(val) {
                try {
                    statSync(that.logFile + '/info.log');
                } catch (e) {
                    writeFileSync(that.logFile + '/info.log', '');
                }
                appendFileSync(that.logFile + '/info.log', `[${new Date()}] ${val}\n`);
            },
            error(val) {
                try {
                    statSync(that.logFile + '/error.log');
                } catch (e) {
                    writeFileSync(that.logFile + '/error.log', '');
                }
                appendFileSync(that.logFile + '/error.log', `[${new Date()}] ${val}\n`);
            }
        }
    }


    /**
     * 删除目录和内部文件
     * */
    delDir(path) {
        let files = [];
        if (existsSync(path)) {
            files = readdirSync(path);
            files.forEach((file, index) => {
                let curPath = path + "/" + file;
                if (statSync(curPath).isDirectory()) {
                    this.delDir(curPath); //递归删除文件夹
                } else {
                    unlinkSync(curPath); //删除文件
                }
            });
            rmdirSync(path);
        }
    }

    /**
     * 去除空格
     * */
    trim(str) {
        return str.replace(/^\s*|\s*$/g, "");
    }

    /**
     * 判空
     * */
    isNull(arg) {
        if (typeof arg === 'string') arg = this.trim(arg);
        return !arg && arg !== 0 && typeof arg !== "boolean" ? true : false;
    }

    /**
     * isJson
     * str : string
     * */
    toJSON(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return str;
        }
    }

    /**
     * 随机整数
     * 例如 6-10 （m-n）
     * */
    Random(m, n) {
        return Math.floor(Math.random() * (n - m)) + m;
    }

    /**
     * 数组元素互换
     * */
    swapArr(arr, index1, index2) {
        [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
    }

    /**
     * 浏览器缓存
     * */
    storage() {
        let that = this;
        return {
            set(key, value, sk) {
                sk = sk ? 'sessionStorage' : 'localStorage';
                if (typeof value === "boolean" || typeof value === "string") eval(sk).setItem(key, value);
                else eval(sk).setItem(key, JSON.stringify(value));
            },
            get(key, sk) {
                sk = sk ? 'sessionStorage' : 'localStorage';
                let data = eval(sk).getItem(key);
                if (that.isNull(data)) return null;
                return that.toJSON(data);
            },
            remove(key, sk) {
                sk = sk ? 'sessionStorage' : 'localStorage';
                eval(sk).removeItem(key);
            },
            clear(is, sk) {
                sk = sk ? 'sessionStorage' : 'localStorage';
                if (is) {
                    sessionStorage.clear();
                    localStorage.clear();
                } else eval(sk).clear();
            }
        }
    }

    /**
     * 对象转url参数
     * */
    convertObj(data) {
        let _result = [];
        for (let key in data) {
            let value = data[key];
            if (value?.constructor == Array) {
                value.forEach(function (_value) {
                    _result.push(key + "=" + _value);
                });
            } else {
                _result.push(key + '=' + value);
            }
        }
        return _result.join('&');
    }

    /**
     * 网络请求
     * */
    net(url, param) {
        let sendData = {
            headers: {
                'Content-type': 'application/json;charset=utf-8',
                'Authorization': main.Authorization || ''
            },
            outTime: 30000,
            mode: 'cors'
        };
        param = param || {};
        if (param.headers) sendData.headers = param.headers;
        if (param.outTime) sendData.outTime = param.outTime;
        if (param.mode) sendData.mode = param.mode;
        sendData.method = param.method || 'GET';
        if (sendData.method === 'GET') url = url + this.convertObj(param.data);
        else sendData.body = JSON.stringify(param.data);
        let checkStatus = (res) => {
            if (res.status >= 200 && res.status < 300) {
                let Authorization = res.headers.get('Authorization');
                if (Authorization) main.Authorization = Authorization;
                return res;
            }
            const error = new Error(res.statusText);
            error.response = res;
            throw error;
        };
        let timeoutPromise = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject({code: -1, msg: '超时'});
                }, sendData.outTime);
            });
        };
        let fetchPromise = () => {
            return new Promise((resolve, reject) => {
                fetch(url, sendData)
                    .then(checkStatus)
                    .then(res => res.text())
                    .then(data => resolve(this.toJSON(data)))
                    .catch(err => reject(err))
            });
        };
        return new Promise((resolve, reject) => {
            Promise.race([timeoutPromise(), fetchPromise()])
                .then(data => resolve(data))
                .catch(err => reject(err))
        });
    }

    /**
     * 动态加载css/js文件
     * */
    loadCssJs(srcList) {
        srcList = srcList || [];
        let list = [];
        for (let i = 0, len = srcList.length; i < len; i++) {
            let item = srcList[i];
            if (!item) continue;
            let type = item.split('.')[1];
            let dom = document.createElement(type === 'css' ? 'link' : 'script');
            let node = (type === 'css') ? document.getElementsByTagName("head")[0] : document.body;
            if (type === 'css') {
                dom.setAttribute('rel', 'stylesheet');
                dom.setAttribute('href', item);
            } else {
                dom.setAttribute('type', 'text/javascript');
                dom.setAttribute('src', item);
            }
            node.appendChild(dom);
            list.push(new Promise(resolve => {
                if (dom.readyState) {
                    dom.onreadystatechange = () => {
                        if (dom.readyState === 'complete' || dom.readyState === 'loaded') resolve();
                    }
                } else dom.onload = () => resolve();
            }))
        }
        return new Promise(resolve => {
            Promise.all(list).then(values => resolve(values));
        })
    };

    /**
     * 移除已经加载过的css/js文件
     * */
    removeCssJs(srcList) {
        srcList = srcList || [];
        for (let i = 0, len = srcList.length; i < len; i++) {
            let items = srcList[i];
            if (!items) continue;
            let type = items.split('.')[1];
            let element = (type === 'css') ? 'link' : 'script';
            let attr = (type === 'css') ? 'href' : 'src';
            let suspects = document.getElementsByTagName(element);
            for (let s = 0, len = suspects.length; s < len; s++) {
                let item = suspects[s];
                if (!item) continue;
                let attrs = item[attr];
                if (attrs?.indexOf(items) > -1) item.parentNode.removeChild(item);
            }
        }
    };

}

module.exports = util.getInstance();