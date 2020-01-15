'use strict';
const path = require('path');
module.exports = {
    lib: [],
    main: {
        data() {
            return {}
        },
        template: `<div class="subclass" style="display: flex;flex-direction: column;justify-content: space-between;">
           <div>
           <div style="font: normal 18px sans-serif;margin-bottom: 5px;">{{$parent.conf.data.tit}}</div>
           <div>{{$parent.conf.data.text}}</div>
           </div>
           <div style="width: 100%;display: flex;justify-content: flex-end;">
              <button @click="closed" class="button">确定</button>
           </div>
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