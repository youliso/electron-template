'use strict';
const execSync = require('child_process').execSync;
module.exports = {
    keepAlive: true,
    size:[],
    lib: [],
    main: {
        data() {
            return {
                listData: []
            }
        },
        template: `<div class="subclass" style="padding:0;">
           <div><button @click="show" class="button theme" style="width: 100%;font: normal 12px sans-serif;">显示</button></div>
           <div><button @click="closed" class="button theme" style="width: 100%;font: normal 12px sans-serif;color: red;">退出</button></div>
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
            show(){
                window.close();
                this.$util.ipcRenderer.send('show');
            },
            closed(){
                MOUSE_LEAVE = () =>{};
                window.close();
                this.closed_txt = "退出中";
                this.$util.ipcRenderer.send('closed');
            }
        }
    }
};