'use strict';
module.exports = {
    keepAlive: true,
    size: [],
    lib: [],
    main: {
        data() {
            return {}
        },
        template: `<div class="subclass" style="padding:0;display: flex;flex-direction: column;justify-content: center;align-items: center;">
           <div style="display: flex;justify-content: center;"><button @click="show" class="button transparent">显示</button></div>
           <div style="display: flex;justify-content: center;"><button @click="closed" class="button transparent">退出</button></div>
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
            show() {
                window.close();
                this.$ipcRenderer.send('show');
            },
            closed() {
                document.body.onmouseleave = null;
                window.close();
                this.$ipcRenderer.send('closed');
            }
        }
    }
};