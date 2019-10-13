'use strict';
const Home_template = require('./template/home');
const Home_event = require('./event/home');
const _ = require('./api/util');
Home_event.content.innerHTML = Home_template.Home();

_.GetHttp({url:'https://hlds.zixutech.cn/index/server/GetServerPass'}).then(res=>console.log(res)).catch(err=>console.log(err));
