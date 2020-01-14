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
            this.$util.ipcRenderer.send('wsInit', {address: 'http://127.0.0.1:3000', protocols: 'test', options: null})
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