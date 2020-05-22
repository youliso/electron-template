'use strict';
const config = require('../config');
const {remote, ipcRenderer} = require('electron');

/**
 * 去除空格
 * */
let trim = (str) => str.replace(/^\s*|\s*$/g, "");

/**
 * 判空
 * */
let isNull = (arg) => {
    if (typeof arg === 'string') arg = trim(arg);
    return !arg && arg !== 0 && typeof arg !== "boolean" ? true : false
};

/**
 * 随机整数
 * 例如 6-10 （m-n）
 * */
let Random = (m, n) => Math.floor(Math.random() * (n - m)) + m;

/**
 * 数组元素互换
 * */
let swapArr = (arr, index1, index2) => [arr[index1], arr[index2]] = [arr[index2], arr[index1]];

/**
 * isJson
 * str : string
 * */
let toJSON = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
};

/**
 * 浏览器缓存
 * */
let storage = {
    set(key, value, sk) {
        sk = sk ? 'sessionStorage' : 'localStorage';
        if (typeof value === "boolean" || typeof value === "string") eval(sk).setItem(key, value);
        else eval(sk).setItem(key, JSON.stringify(value));
    },
    get(key, sk) {
        sk = sk ? 'sessionStorage' : 'localStorage';
        let data = eval(sk).getItem(key);
        if (isNull(data)) return null;
        return toJSON(data);
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
};

/**
 * 对象转url参数
 * */
let convertObj = (data) => {
    let _result = [];
    for (let key in data) {
        let value = data[key];
        if (value && value.constructor == Array) {
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
 * 网络请求
 * */
let net = (url, param) => {
    let sendData = {
        headers: {
            'Content-type': 'application/json;charset=utf-8',
            'Authorization': remote.getGlobal('App_Data').Authorization || ''
        },
        outTime: 30000,
        mode: 'cors'
    };
    param = param || {};
    if (param.headers) sendData.headers = param.headers;
    if (param.outTime) sendData.outTime = param.outTime;
    if (param.mode) sendData.mode = param.mode;
    sendData.method = param.method || 'GET';
    if (sendData.method === 'GET') url = url + convertObj(param.data);
    else sendData.body = JSON.stringify(param.data);
    let checkStatus = (res) => {
        if (res.status >= 200 && res.status < 300) {
            let Authorization = res.headers.get('Authorization');
            if (Authorization) remote.getGlobal('App_Data').Authorization = Authorization;
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
                .then(data => resolve(toJSON(data)))
                .catch(err => reject(err))
        });
    };
    return new Promise((resolve, reject) => {
        Promise.race([timeoutPromise(), fetchPromise()])
            .then(data => resolve(data))
            .catch(err => reject(err))
    });
};

/**
 * 动态加载css/js文件
 * */
let loadCssJs = (srcList) => {
    srcList = srcList || [];
    let list = [];
    for (let i = 0, len = srcList.length; i < len; i++) {
        let item = srcList[i];
        if (!item) break;
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
let removeCssJs = (srcList) => {
    srcList = srcList || [];
    for (let i = 0, len = srcList.length; i < len; i++) {
        let items = srcList[i];
        let type = items.split('.')[1];
        let element = (type === 'css') ? 'link' : 'script';
        let attr = (type === 'css') ? 'href' : 'src';
        let suspects = document.getElementsByTagName(element);
        for (let s = 0, len = suspects.length; s < len; s++) {
            let item = suspects[s];
            if (!item) break;
            let attrs = item[attr];
            if (attrs != null && attrs.indexOf(items) > -1) item.parentNode.removeChild(item);
        }
    }
};

/**
 * 弹框初始化参数
 * */
let dataJsonPort = () => {
    return new Promise((resolve, reject) => {
        ipcRenderer.on('dataJsonPort', async (event, message) => {
            resolve(message);
        });
    });
};

/**
 * 主体初始化
 * @param Vue
 * */
let init = async (Vue, el, conf) => {
    conf = conf ? JSON.parse(decodeURIComponent(conf)) : null;
    Vue.prototype.$config = config;
    Vue.prototype.$util = {
        trim,
        isNull,
        Random,
        swapArr,
        net,
        loadCssJs,
        removeCssJs,
        storage,
        remote,
        ipcRenderer
    };
    Vue.prototype.$srl = (srl) => config.appUrl + srl;
    const view = async (key, view) => {
        let {lib, size, main} = require(view);
        Vue.component(key, main);
        return {lib, size};
    };
    let viewsList = [];
    for (let i of config[`${el}-assembly`]) {
        viewsList.push(view(`${el}-${i.substring(i.lastIndexOf('/') + 1, i.lastIndexOf('.'))}`, i));
    }
    await Promise.all(viewsList);
    const AppComponents = {};
    for (let i of config[`${el}-views`]) {
        i.name = `${el}-${i.v.substring(i.v.lastIndexOf('/') + 1, i.v.lastIndexOf('.'))}`;
        AppComponents[i.name] = i;
    }
    let app_data = {
        IComponent: null,
        AppComponents,
        loadedComponents: [],
        head: true,
        themeColor: config.themeColor
    };
    if (conf) app_data.conf = conf;
    app_data.headKey = el + '-';
    return {
        el: `#${el}`,
        data: app_data,
        async created() {
            switch (el) {
                case 'app':
                    this.init('home');
                    break;
                case 'dialog':
                    this.init(this.conf.v);
                    break;
                case 'menu':
                    this.init('home');
            }
        },
        methods: {
            async init(componentName) {
                this.socketMessage();
                this.dialogMessage();
                await this.switchComponent(componentName);
            },
            async switchComponent(key, args) {
                let size_ = [];
                key = this.headKey + key;
                if (this.loadedComponents.indexOf(key) < 0) {
                    let {lib, size} = await view(key, this.AppComponents[key].v);
                    if (size) size_ = size;
                    await this.$util.loadCssJs(lib)
                    if (this.loadedComponents.length > 0) await this.$util.removeCssJs(this.IComponent.lib);
                    this.AppComponents[key].lib = lib;
                    this.AppComponents[key].size = size;
                } else {
                    size_ = this.AppComponents[key].size;
                    await this.$util.loadCssJs(this.AppComponents[key].lib)
                    await this.$util.removeCssJs(this.IComponent.lib)
                }
                let Rectangle = {};
                switch (this.$el.id) {
                    case 'app':
                        Rectangle = {
                            width: this.$util.remote.getGlobal('App_Data').app_w,
                            height: this.$util.remote.getGlobal('App_Data').app_h
                        }
                        break;
                    case 'dialog':
                        Rectangle = {
                            width: this.$util.remote.getGlobal('App_Data').dia_w,
                            height: this.$util.remote.getGlobal('App_Data').dia_h
                        }
                        break;
                    case 'menu':
                        Rectangle = {
                            width: this.$util.remote.getGlobal('App_Data').menu_w,
                            height: this.$util.remote.getGlobal('App_Data').menu_h
                        }
                }
                if (size_ && size_.length > 0) {
                    Rectangle.width = size_[0];
                    Rectangle.height = size_[1];
                    Rectangle.x = this.$util.remote.getCurrentWindow().getPosition()[0] + ((this.$util.remote.getCurrentWindow().getBounds().width - size_[0]) / 2);
                    Rectangle.y = this.$util.remote.getCurrentWindow().getPosition()[1] + ((this.$util.remote.getCurrentWindow().getBounds().height - size_[1]) / 2);
                } else {
                    Rectangle.x = this.$util.remote.getCurrentWindow().getPosition()[0] + ((this.$util.remote.getCurrentWindow().getBounds().width - Rectangle.width) / 2);
                    Rectangle.y = this.$util.remote.getCurrentWindow().getPosition()[1] + ((this.$util.remote.getCurrentWindow().getBounds().height - Rectangle.height) / 2);
                }
                this.$util.remote.getCurrentWindow().setBounds(Rectangle);
                this.IComponent = this.AppComponents[key];
                this.$args = args;
            },
            socketInit() {
                this.$util.ipcRenderer.send('socketInit', this.$config.socket_url);
            },
            socketMessage() {
                this.$util.ipcRenderer.on('message', (event, req) => {
                    switch (req.code) {
                        case 0:
                            let path = req.result.split('.');
                            if (path.length === 1) this[this.headKey + path[0]] = req.data;
                            if (path.length === 2) this.$refs[this.headKey + path[0]][path[1]] = req.data;
                            break;
                        case -1:
                            console.log(req.msg);
                            break;
                        default:
                            console.log('socketMessage...');
                            console.log(req)
                    }
                })
            },
            socketSend(path, result, data) {
                this.$util.ipcRenderer.send('socketSend', JSON.stringify({path, result, data}));
            },
            dialogInit(data) {
                let args = {
                    name: data.name, //名称
                    v: data.v, //页面id
                    data: data.data, //数据
                    complex: false, //是否支持多窗口
                    parent: 'win' //父窗口
                };
                if (this.conf) args.parent = this.conf.id;
                if (data.v === 'message') args.complex = true;
                if (data.r) args.r = data.r;
                if (data.complex) args.complex = data.complex;
                this.$util.ipcRenderer.send('new-dialog', args);
            },
            dialogMessage() {
                this.$util.ipcRenderer.on('newWin-rbk', (event, req) => {
                    let path = req.r.split('.');
                    if (path.length === 1) this[this.headKey + path[0]] = req.data;
                    if (path.length === 2) this.$refs[this.headKey + path[0]][path[1]] = req.data;
                })
            },
            dialogSend(args) {
                this.$util.ipcRenderer.send('newWin-feedback', args);
            }
        },
        watch: {
            IComponent(val) {
                let index1 = this.loadedComponents.indexOf(val.name);
                if (index1 < 0) this.loadedComponents.unshift(val.name);
                else this.$util.swapArr(this.loadedComponents, index1, 0);
            }
        }
    }
};

module.exports = {init, dataJsonPort};