'use strict';
const fs = require("fs");

//写入
const WriteIn = (obj) => {
    fs.writeFile(obj.url, JSON.stringify(obj.data), (err) => {
        if (err) obj.callback(false);
        obj.callback(obj.data);
    });
};

//读取
const ReadFile = (obj) => {
    fs.readFile(obj.url, obj.encoding || "utf8", (err, data) => {
        if (err) obj.callback(false);
        obj.callback(data);
    });
};

//请求
const getHttp = async (obj) => {
    let data = Buffer.from([]);
    obj.method = obj.method || 'GET';
    const request = remote.net.request(obj);
    if (obj.header) request.setHeader(obj.header.name, obj.header.value);
    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`);
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

//判断是否为空
const isEmpty = (obj) => typeof obj == "undefined" || obj == null || obj == "";

//毫秒转分时
const formatSeconds = (value) => {
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

//img加载错误处理
const imgVs = (imgVs) => {
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
    getHttp,
    isEmpty,
    formatSeconds,
    getServerInfo
};