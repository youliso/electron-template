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
        </div>`,
        async created() {
            let newWin = new this.util.remote.BrowserWindow(this.util.remote.getGlobal('WinOpt')(200, 100));
            await newWin.loadFile(path.join(__dirname, '../dialog.html'));
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
        methods: {}
    }
};