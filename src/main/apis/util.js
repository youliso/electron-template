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
            'Authorization': storage.get('Authorization', true) || ''
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
            if (Authorization) storage.set('Authorization', res.headers.get('Authorization'), true);
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
 * 创建 WebSocket
 * */
let CreateWebSocket = (urlValue, option) => {
    if (window.WebSocket) return new WebSocket(urlValue, option);
    if (window.MozWebSocket) return new MozWebSocket(urlValue, option);
    return false;
};

/**
 * 动态加载css/js文件
 * */
let loadCssJs = (srcList) => {
    let doc = document;
    let list = [];
    for (let i = 0, len = srcList.length; i < len; i++) {
        let item = srcList[i];
        if (!item) break;
        let type = item.split('.')[1];
        let dom = doc.createElement(type === 'css' ? 'link' : 'script');
        let node = (type === 'css') ? doc.getElementsByTagName("head")[0] : doc.body;
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
 * 初始化
 * @param Vue
 * */
let init = async (Vue) => {
    const doc = document;
    const config = require('../cfg/config');
    const {remote, ipcRenderer} = require('electron');
    Vue.prototype.config = config;
    Vue.prototype.util = {
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
    Vue.prototype.srl = (srl) => config.url + srl;
    Vue.prototype.toast = swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', swal.stopTimer);
            toast.addEventListener('mouseleave', swal.resumeTimer);
        }
    });
    const view = async (key, view) => {
        let {lib, main} = require(view);
        Vue.component(key, main);
        return lib;
    };
    let viewsList = [];
    for (let key in config.assembly) viewsList.push(view(key, config.assembly[key].v));
    await Promise.all(viewsList);
    const AppComponents = {};
    for (let key in config.views) {
        let item = config.views[key];
        AppComponents[key] = item;
        AppComponents[key].name = key;
    }
    let componentName = storage.get('component-name');
    let componentSubListIndex = storage.get('component-subListIndex');
    let themeColor = storage.get('themeColor');
    let head = true;
    let userInfo = storage.get('userInfo', true);
    if (isNull(componentName)) componentName = 'app-home';
    if (isNull(userInfo)) {
        let userPwd = storage.get('userPwd');
        if (userPwd) {
            let entData = await net(`${config.url}user/login`, {
                method: 'POST',
                data: userPwd
            }).catch(err => console.log(err));
            if (entData.code === 0) {
                userInfo = entData.data;
                storage.set('userInfo', userInfo, true);
            } else {
                this.toast.fire({
                    icon: 'error',
                    title: entData.msg
                });
                componentName = 'app-login';
            }
        } else {
            componentName = 'app-login';
            head = false;
        }
    }
    if (isNull(themeColor)) themeColor = config.colors.black;
    return {
        el: '#app',
        data: {
            initLoading: true,
            subjectLoading: false,
            IComponent: null,
            AppComponents,
            loadedComponents: [],
            head,
            themeColor,
            userInfo,
            wsView: null,
            ws: null
        },
        async created() {
            if (componentName === 'app-login') {
                this.init();
                await this.switchComponent(componentName);
                if (this.IComponent.sub && componentSubListIndex) this.IComponent.subListIndex = componentSubListIndex;
                this.initLoading = false;
            } else this.wsInit();
        },
        methods: {
            init() {
                doc.documentElement.setAttribute('style', `--theme:${this.themeColor}`);
                doc.querySelector('meta[name="theme-color"]').setAttribute('content', this.themeColor);
                doc.querySelector('meta[name="msapplication-navbutton-color"]').setAttribute('content', this.themeColor);
                let swalOpt = {
                    confirmButtonColor: this.themeColor,
                    cancelButtonColor: config.colors.gray,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    width: '32rem'
                };
                Vue.prototype.alert = swal.mixin(swalOpt);
            },
            hideNav() {
                if (this.isNav) this.isNav = false;
                if (this.isUser) this.isUser = false;
            },
            async switchComponent(key) {
                let libList = [];
                this.subjectLoading = true;
                if (this.loadedComponents.indexOf(key) < 0) {
                    let lib = await view(key, this.AppComponents[key].v);
                    libList.push(this.util.loadCssJs(lib));
                    if (this.loadedComponents.length > 0) libList.push(this.util.removeCssJs(this.IComponent.lib));
                    this.AppComponents[key].lib = lib;
                } else {
                    libList.push(this.util.loadCssJs(this.AppComponents[key].lib));
                    libList.push(this.util.removeCssJs(this.IComponent.lib));
                }
                if (this.AppComponents[key].show) this.head = true;
                else this.head = false;
                await Promise.all(libList);
                this.IComponent = this.AppComponents[key];
                this.subjectLoading = false;
                console.log(this.$refs);
            },
            wsInit() {
                let token = storage.get('Authorization', true);
                if (!this.ws && token) {
                    this.ws = CreateWebSocket(config.ws, [token]);
                    this.ws.onopen = evt => {
                        console.log('[ws] init')
                    };
                    this.ws.onmessage = evt => {
                        let req = JSON.parse(evt.data);
                        if (req.code === 11) {
                            //连接成功
                            swal.close();
                            this.WsFirst();
                            return;
                        }
                        if (req.code === 22) {
                            //刷新token
                            storage.set('Authorization', req.data, true);
                            return;
                        }
                        if (req.code === 0) {
                            let path = req.result.split('.');
                            if (path.length === 1) this[path[0]] = req.data;
                            if (path.length === 2) if (this.$refs[path[0]]) this.$refs[path[0]][path[1]] = req.data;
                        }
                        if (req.code === -1) {
                            this.toast.fire({
                                icon: 'error',
                                title: req.msg
                            });
                            this.wsView = null;
                        }
                    };
                    this.ws.onclose = evt => {
                        console.log('[ws] close');
                        this.ws = null;
                    };
                }
            },
            wsSend(path, result, data) {
                if (this.ws) this.ws.send(JSON.stringify({path, result, data}))
            },
            async WsFirst() {
                console.log('[ws] ready');
                //ws准备就绪后启动
                if (this.initLoading) {
                    this.init();
                    await this.switchComponent(componentName);
                    if (this.IComponent.sub && componentSubListIndex) this.IComponent.subListIndex = componentSubListIndex;
                    this.initLoading = false;
                } else {
                    await this.switchComponent(this.wsView);
                    this.wsView = null;
                }
            }
        },
        watch: {
            async wsView(val) {
                if (val) {
                    if (this.IComponent.name === 'app-login') this.ws = null;
                    this.wsInit();
                }
            },
            IComponent(val, newVal) {
                let index1 = this.loadedComponents.indexOf(val.name);
                if (index1 < 0) this.loadedComponents.unshift(val.name);
                else this.util.swapArr(this.loadedComponents, index1, 0);
                if (this.config['no-view-storage'].indexOf(val.name) < 0) this.util.storage.set('component-name', val.name);
                doc.title = this.config.title + ' - ' + val.title + (val.sub ? '·' + val.subList[val.subListIndex].name : '');
            },
            'IComponent.subListIndex'(val, newVal) {
                if (this.IComponent.subListIndex != null) this.util.storage.set('component-subListIndex', this.IComponent.subListIndex);
                doc.title = this.config.title + ' - ' + this.IComponent.title + (this.IComponent.sub ? '·' + this.IComponent.subList[this.IComponent.subListIndex].name : '');
            },
            themeColor(val, newVal) {
                this.init();
                this.util.storage.set('themeColor', val);
            }
        }
    }
};

module.exports = {init};
/**
 * vue.min.js : //unpkg.com/vue/dist/vue.min.js
 * animate.css : //cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.css
 * jquery.min.js : //unpkg.com/jquery/dist/jquery.min.js
 * sweetalert2.min.js : //unpkg.com/sweetalert2/dist/sweetalert2.min.js
 * babel-polyfill : //unpkg.com/babel-polyfill/dist/polyfill.min.js
 * */