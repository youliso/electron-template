'use strict';
const path = require('path');
module.exports = {
    size: [],
    lib: [],
    main: {
        data() {
            return {
                listData: []
            }
        },
        template: `<div class="subclass" style="display: flex;flex-direction: column;justify-content: space-between;">
           <div>是否最小化到托盘?</div>
           <div>
           <button @click="closed(0)" class="button no-drag">确定</button>
           <button @click="closed(1)" class="button no-drag">取消</button>
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
            closed(is) {
                if (is === 1) this.$ipcRenderer.send('closed')
                else {
                    this.$ipcRenderer.send('hide');
                    this.$ipcRenderer.send('newWin-closed', this.$parent.conf.id);
                }
            }
        }
    }
};