'use strict';
const path = require('path');
module.exports = {
    lib: [],
    main: {
        data() {
            return {
                listData: []
            }
        },
        template: `<div class="subclass">
           <h4>demo</h4>
           <button @click="newWin" class="button">新窗口</button>
        </div>`,
        async created() {
        },
        beforeDestroy() {
            //卸载
        },
        activated() {
            //开启缓存后 切换加载
        },
        deactivated() {
            //开启缓存后 切换卸载
        },
        methods: {
            async newWin() {
                let newWin = new this.util.remote.BrowserWindow(this.util.remote.getGlobal('WinOpt')(400, 200));
                // 打开开发者工具
                newWin.webContents.openDevTools();
                //注入初始化代码
                newWin.webContents.on("did-finish-load", () => {
                    let js = `require('./lib/util')(Vue,'#dialog').then(lib => new Vue(lib));`;
                    newWin.webContents.executeJavaScript(js);
                });
                await newWin.loadFile(path.join(__dirname, '../dialog.html'));
                newWin.show();
            }
        }
    }
};