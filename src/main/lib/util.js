'use strict';
const {net, BrowserWindow} = require('electron').remote;
const fs = require("fs");

/**
 * 写入
 * */
const WriteIn = async (obj) => {
    fs.writeFile(obj.url, JSON.stringify(obj.data), (err) => {
        if (err) throw err;
        return obj.data;
    });
};

/**
 * 读取
 * */
const ReadFile = async (obj) => {
    fs.readFile(obj.url, obj.encoding || "utf8", (err, data) => {
        if (err) throw err;
        return data;
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
    win.on('close', () =>{ win = null});
    win.loadURL(obj.path);
    win.show();
    return win;
};

/**
 * 请求
 * obj:{
 * method String (可选) - HTTP请求方法. 默认为GET方法.
 * url String (可选) - 请求的URL. 必须在指定了http或https的协议方案的独立表单中提供.
 * session Object (可选) - 与请求相关联的Session实例.
 * partition String (可选) - 与请求相关联的partition名称. 默认为空字符串. session选项优先于partition选项. 因此, 如果session是显式指定的, 则partition将被忽略.
 * protocol String (可选) - 在"scheme:"表单中的协议方案. 目前支持的值为'http:' 或者'https:'. 默认为'http:'.
 * host String (可选) - 作为连接提供的服务器主机,主机名和端口号'hostname:port'.
 * hostname String (可选) - 服务器主机名.
 * port Integer (可选) - 服务器侦听的端口号.
 * path String (可选) - 请求URL的路径部分.
 * redirect String (可选) - 请求的重定向模式. 可选值为 follow, error 或 manual. 默认值为 follow. 当模式为error时, 重定向将被终止. 当模式为 manual时，表示延迟重定向直到调用了 request.followRedirect。 在此模式中侦听 redirect事件，以获得关于重定向请求的更多细节。
 * }
 * */
const GetHttp = async (obj) => {
    let data = Buffer.from([]);
    obj.method = obj.method || 'GET';
    const request = net.request(obj);
    if (obj.header) request.setHeader(obj.header.name, obj.header.value);
    request.on('response', (response) => {
        response.on('data', (chunk) => {
            data = Buffer.concat([data, chunk]);
            if (data.length == response.headers['content-length']) return data;
        });
        response.on('error', (error) => {
            throw error
        });
        response.on('end', () => console.log(`end`))
    });
    request.on('error', (error) => {
        throw error
    });
    request.end();
};

/**
 * 判断是否为空
 * obj String
 * */
const IsEmpty = (obj) => typeof obj == "undefined" || obj == null || obj == "";

/**
 * 毫秒转分时
 * */
const FormatSeconds = (value) => {
    let theTime = parseInt(value);// 秒
    let middle = 0;// 分
    let hour = 0;// 小时
    if (theTime > 60) {
        middle = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (middle > 60) {
            hour = parseInt(middle / 60);
            middle = parseInt(middle % 60);
        }
    }
    let result = "" + parseInt(theTime) + "秒";
    if (middle > 0) result = "" + parseInt(middle) + "分" + result;
    if (hour > 0) result = "" + parseInt(hour) + "小时" + result;
    return result;
};

/**
 * img加载错误处理
 * */
const IsImg = (imgVs) => {
    let img = document.getElementsByTagName("img");
    for (let i = 0; i < img.length; i++) {
        let att = img[i].getAttribute("data");
        if (att != "" && att != null) { //没有定义data属性的图片我们不检查
            (function (a, b) {
                img[a].src = imgVs;
                let pic = new Image();
                pic.src = b;
                pic.onload = function () {
                    pic.onload = null;
                    img[a].src = b;
                };
                pic.onerror = function () {
                    pic.onerror = null;
                    img[a].src = imgVs;
                }
            })(i, att)
        }
    }
};

module.exports = {
    WriteIn,
    ReadFile,
    GetHttp,
    IsEmpty,
    IsImg,
    FormatSeconds
};