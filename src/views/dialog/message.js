'use strict';
const path = require('path');
module.exports = {
    lib: [],
    main: {
        data() {
            return {}
        },
        template: `<div class="subclass" style="display: flex;flex-direction: column;justify-content: space-between;">
           <div>{{$parent.conf.data.text}}</div>
           <div><button @click="closed" class="button no-drag">确定</button></div>
        </div>`,
        created() {
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
            closed() {
                this.$util.ipcRenderer.send('newWin-closed', this.$parent.conf.id)
            }
        }
    }
};