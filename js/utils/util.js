/**
 * 简单易懂的ajax封装
 * */
const ajax = (param) => {
    return new Promise((resolve, reject) => {
        let client;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            client = new XMLHttpRequest();
        } else {// code for IE6, IE5
            client = new ActiveXObject("Microsoft.XMLHTTP");
        }
        client.open(param.method || "GET", param.url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send(param.data || null);

        function handler() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        }
    });
};

/**
 * 判断是否数字
 * */
const isNumber = (str) => {
    let patrn = /^[0-9]*$/;
    if (patrn.exec(str) == null || str == "") {
        return false;
    } else {
        return true;
    }
};

/**
 * 判断是否对象
 * */
const isObj = (obj) => {
    if (typeof obj == "object") {
        return true;
    } else {
        return false;
    }
};

/**
 * 判断是否为空
 * */
const isNull = (obj) => {
    if (obj == "" || obj == null || obj == undefined || obj == "null" || obj == "undefined") {
        return true;
    } else {
        return false;
    }
};

/**
 * 获取url参数
 * */
const GetQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};


/**
 * 时间日期格式转换 (按需更改，是否调用原方法， 还是重写)
 */
if (!Date.prototye.format && !Date.prototype.Format) {
    Date.prototype.Format = (formatStr) => {
        let str = formatStr;
        let Week = ['日', '一', '二', '三', '四', '五', '六'];
        str = str.replace(/yyyy|YYYY/, this.getFullYear());
        str = str.replace(/yy|YY/,
            (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString()
                : '0' + (this.getYear() % 100));
        str = str.replace(/MM/,
            (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString()
                : '0' + (this.getMonth() + 1));
        str = str.replace(/M/g, (this.getMonth() + 1));
        str = str.replace(/w|W/g, Week[this.getDay()]);
        str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate()
            .toString() : '0' + this.getDate());
        str = str.replace(/d|D/g, this.getDate());
        str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours()
            .toString() : '0' + this.getHours());
        str = str.replace(/h|H/g, this.getHours());
        str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes()
            .toString() : '0' + this.getMinutes());
        str = str.replace(/m/g, this.getMinutes());
        str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds()
            .toString() : '0' + this.getSeconds());
        str = str.replace(/s|S/g, this.getSeconds());
        return str;
    };
}


/**
 * 字符串长度截取 params: str:字符串 length:长度
 */
const cutstr = (str, length) => {
    let temp;
    let icount = 0;
    let patrn = /[^\x00-\xff]/;
    let strre = "";
    for (let i = 0; i < str.length; i++) {
        if (icount < len - 1) {
            temp = str.substr(i, 1);
            if (patrn.exec(temp) == null) {
                icount = icount + 1;
            } else {
                icount = icount + 2;
            }
            strre += temp;
        } else {
            break;
        }
    }
    return strre + "...";
};


/**
 * 返回浏览器版本
 *
 * 返回一个对象,对象属性：type，version
 */

const getExplorerInfo = () => {
    let explorer = window.navigator.userAgent.toLowerCase();
    // ie
    if (explorer.indexOf("msie") >= 0) {
        let ver = explorer.match(/msie ([\d.]+)/)[1];
        return {
            type: "IE",
            version: ver
        };
    }
    // firefox
    else if (explorer.indexOf("firefox") >= 0) {
        let ver = explorer.match(/firefox\/([\d.]+)/)[1];
        return {
            type: "Firefox",
            version: ver
        };
    }
    // Chrome
    else if (explorer.indexOf("chrome") >= 0) {
        let ver = explorer.match(/chrome\/([\d.]+)/)[1];
        return {
            type: "Chrome",
            version: ver
        };
    }
    // Opera
    else if (explorer.indexOf("opera") >= 0) {
        let ver = explorer.match(/opera.([\d.]+)/)[1];
        return {
            type: "Opera",
            version: ver
        };
    }
    // Safari
    else if (explorer.indexOf("Safari") >= 0) {
        let ver = explorer.match(/version\/([\d.]+)/)[1];
        return {
            type: "Safari",
            version: ver
        };
    }
};

/**
 * 实现checkbox全选与全不选
 */
const checkAll = (selectAllBoxId, childBoxsId) => {
    let selectall = document.getElementById(selectAllBoxId);
    let allbox = document.getElementsByName(childBoxsId);
    if (selectall.checked) {
        for (let i = 0; i < allbox.length; i++) {
            allbox[i].checked = true;
        }
    } else {
        for (let i = 0; i < allbox.length; i++) {
            allbox[i].checked = false;
        }
    }
};

/**
 * 判断是否移动设备
 */
const isMobile = () => {
    if (typeof this._isMobile === 'boolean') {
        return this._isMobile;
    }
    let screenWidth = this.getScreenWidth();
    let fixViewPortsExperiment = rendererModel.runningExperiments.FixViewport
        || rendererModel.runningExperiments.fixviewport;
    let fixViewPortsExperimentRunning = fixViewPortsExperiment
        && (fixViewPortsExperiment.toLowerCase() === "new");
    if (!fixViewPortsExperiment) {
        if (!this.isAppleMobileDevice()) {
            screenWidth = screenWidth / window.devicePixelRatio;
        }
    }
    let isMobileScreenSize = screenWidth < 600;
    let isMobileUserAgent = false;
    this._isMobile = isMobileScreenSize && this.isTouchScreen();
    return this._isMobile;
};

/**
 * 判断是否移动设备访问
 */
const isMobileUserAgent = () => {
    return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i
        .test(window.navigator.userAgent.toLowerCase()));
};

/**
 * 判断是否苹果移动设备访问
 */
const isAppleMobileDevice = () => {
    return (/iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent
        .toLowerCase()));
};

/**
 * 判断是否安卓移动设备访问
 */
const isAndroidMobileDevice = () => {
    return (/android/i.test(navigator.userAgent.toLowerCase()));
};

/**
 * 判断是否Touch屏幕
 */
const isTouchScreen = () => {
    return (('ontouchstart' in window) || window.DocumentTouch
        && document instanceof DocumentTouch);
};

/**
 * 判断是否在安卓上的谷歌浏览器
 */
const isNewChromeOnAndroid = () => {
    if (this.isAndroidMobileDevice()) {
        let userAgent = navigator.userAgent.toLowerCase();
        if ((/chrome/i.test(userAgent))) {
            let parts = userAgent.split('chrome/');
            let fullVersionString = parts[1].split(" ")[0];
            let versionString = fullVersionString.split('.')[0];
            let version = parseInt(versionString);

            if (version >= 27) {
                return true;
            }
        }
    }
    return false;
};

/**
 * 判断是否打开视窗
 */
const isViewportOpen = () => {
    return !!document.getElementById('wixMobileViewport');
};

/**
 * 获取移动设备初始化大小
 */
const getInitZoom = () => {
    if (!this._initZoom) {
        let screenWidth = Math.min(screen.height, screen.width);
        if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
            screenWidth = screenWidth / window.devicePixelRatio;
        }
        this._initZoom = screenWidth / document.body.offsetWidth;
    }
    return this._initZoom;
};

/**
 * 获取移动设备最大化大小
 */
const getZoom = () => {
    let screenWidth = (Math.abs(window.orientation) === 90) ? Math.max(screen.height, screen.width) : Math.min(screen.height, screen.width);
    if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
        screenWidth = screenWidth / window.devicePixelRatio;
    }
    let FixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport;
    let FixViewPortsExperimentRunning = FixViewPortsExperiment && (FixViewPortsExperiment === "New" || FixViewPortsExperiment === "new");
    if (FixViewPortsExperimentRunning) {
        return screenWidth / window.innerWidth;
    } else {
        return screenWidth / document.body.offsetWidth;
    }
};

/**
 * 获取移动设备屏幕宽度
 */
const getScreenWidth = () => {
    let smallerSide = Math.min(screen.width, screen.height);
    let fixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport;
    let fixViewPortsExperimentRunning = fixViewPortsExperiment && (fixViewPortsExperiment.toLowerCase() === "new");
    if (fixViewPortsExperiment) {
        if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
            smallerSide = smallerSide / window.devicePixelRatio;
        }
    }
    return smallerSide;
};

/**
 * 获取页面高度
 */
const getPageHeight = () => {
    let g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat"
        ? a
        : g.documentElement;
    return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
};

/**
 * 获取页面scrollLeft
 */
const getPageScrollLeft = () => {
    let a = document;
    return a.documentElement.scrollLeft || a.body.scrollLeft;
};


/**
 * 获取页面宽度
 */
const getPageWidth = () => {
    let g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat"
        ? a
        : g.documentElement;
    return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
};

/**
 * 获取页面scrollTop
 */
const getPageScrollTop = () => {
    let a = document;
    return a.documentElement.scrollTop || a.body.scrollTop;
};

/**
 * 获取页面可视高度
 */
const getPageViewHeight = () => {
    let d = document, a = d.compatMode == "BackCompat"
        ? d.body
        : d.documentElement;
    return a.clientHeight;
};

