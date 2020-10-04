const config = require('../cfg/config.json');

interface NetSendOpt extends RequestInit {
    outTime?: number; //请求超时时间
}

class Tool {
    private static instance: Tool;

    static getInstance() {
        if (!Tool.instance) Tool.instance = new Tool();
        return Tool.instance;
    }

    constructor() {
    }

    /**
     * 去除空格
     * */
    trim(str: string) {
        return str.replace(/^\s*|\s*$/g, "");
    }

    /**
     * 判空
     * */
    isNull(arg: unknown) {
        if (typeof arg === 'string') arg = this.trim(arg);
        return !arg && arg !== 0 && typeof arg !== "boolean" ? true : false;
    }

    /**
     * 随机整数
     * 例如 6-10 （m-n）
     * */
    ranDom(m: number, n: number) {
        return Math.floor(Math.random() * (n - m)) + m;
    }

    /**
     * 数组元素互换
     * */
    swapArr(arr: unknown[], index1: number, index2: number) {
        [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
    }

    /**
     * 动态加载css/js文件
     * */
    loadCssJs(srcList: string[]) {
        srcList = srcList || [];
        let list: unknown[] = [];
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
                // @ts-ignore
                if (dom.readyState) {
                    // @ts-ignore
                    dom.onreadystatechange = () => {
                        // @ts-ignore
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
    removeCssJs(srcList: string[]) {
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
                // @ts-ignore
                let attrs = item[attr];
                if (attrs?.indexOf(items) > -1) item.parentNode?.removeChild(item);
            }
        }
    }

    /**
     * 对象转url参数
     * */
    convertObj(data: unknown) {
        let _result = [];
        // @ts-ignore
        for (let key in data) {
            // @ts-ignore
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
     * @param url string
     * @param param NetSendOpt
     * */
    net(url: string, param: NetSendOpt) {
        if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) url = config.appUrl + url;
        let sendData: NetSendOpt = {
            headers: {
                'Content-type': 'application/json;charset=utf-8',
                'Authorization': sessionStorage.getItem('Authorization') as string || ''
            },
            outTime: 30000,
            mode: 'cors'
        };
        param = param || {};
        if (param.headers) sendData.headers = param.headers;
        if (param.outTime) sendData.outTime = param.outTime;
        if (param.mode) sendData.mode = param.mode;
        sendData.method = param.method || 'GET';
        if (sendData.method === 'GET') url = url + this.convertObj(param.body);
        else sendData.body = JSON.stringify(param.body);
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
                            if (Authorization) sessionStorage.setItem('Authorization', Authorization);
                            return res;
                        }
                        throw new Error(res.statusText);
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

export default Tool.getInstance();
