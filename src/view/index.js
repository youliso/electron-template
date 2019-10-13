const _ = require('../lib/util');
_.GetHttp({url:"https://hlds.zixutech.cn/index/server/GetServerPass"}).then(res => {
    console.log(res)
}).catch(err => console.log(err));
