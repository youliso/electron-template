'use strict';
const storage = require('./storage');
const config = require('../cfg/config.json');

class general {
    static getInstance() {
        if (!general.instance) general.instance = new general();
        return general.instance;
    }

    constructor() {
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
     * 随机整数
     * 例如 6-10 （m-n）
     * */
    ranDom(m, n) {
        return Math.floor(Math.random() * (n - m)) + m;
    }

    /**
     * 数组元素互换
     * */
    swapArr(arr, index1, index2) {
        [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
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
    }

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
        if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) url = config.appUrl + url;
        let sendData = {
            headers: {
                'Content-type': 'application/json;charset=utf-8',
                'Authorization': storage.sessionGet('Authorization') || ''
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
                    .then(res => {
                        if (res.status >= 200 && res.status < 300) {
                            let Authorization = res.headers.get('Authorization');
                            if (Authorization) storage.sessionSet('Authorization', Authorization);
                            return res;
                        }
                        const error = new Error(res.statusText);
                        error.response = res;
                        throw error;
                    })
                    .then(res => res.text())
                    .then(data => {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            resolve(data);
                        }
                    })
                    .catch(err => reject(err))
            });
        };
        return new Promise((resolve, reject) => {
            Promise.race([timeoutPromise(), fetchPromise()])
                .then(data => resolve(data))
                .catch(err => reject(err))
        });
    }
}

module.exports = general.getInstance();