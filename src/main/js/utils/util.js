'use strict';
const {ipcRenderer,shell} = require('electron');
const request = require('request');
const fs = require("fs");

//判断字符是否为空的方法
function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
        return true;
    }else{
        return false;
    }
}

//写入
function WriteIn(obj) {
    fs.writeFile(obj.url, JSON.stringify(obj.data), (err) => {
        if (!err) {
            console.log('[WriteIn]写入文件操作成功');
            obj.callback(true);
        }
        obj.callback(false);
    });
}

//请求
function getHttp(obj) {
    request({
        url: obj.url,
        method: obj.method,
        headers: {
            "content-type": "application/json;charset=UTF-8"
        },
        body: obj.data
    }, (error, response, body) => {
        if (!error && response.statusCode == 200 && body.code == 0) {
            console.log("[getHttp]获取数据成功", body);
            obj.callback(true, body);
        } else {
            console.log("[getHttp]获取数据失败", error);
            obj.callback(false, body);
        }
    });
}

//打开默认浏览器
function openDefaultBrowser(url) {
    shell.openExternal(url);
}

//img加载错误处理
function imgVs(imgVs) {
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
}

//发送消息至主进程
function send(cld) {
    ipcRenderer.send(cld);
}

module.exports = {
    WriteIn,
    getHttp,
    send,
    openDefaultBrowser,
    imgVs,
    isEmpty
};