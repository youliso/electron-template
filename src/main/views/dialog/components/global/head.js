'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {}
        },
        template: `<div class="head">
        <div>
        <span>{{$parent.conf.name}}</span>
        </div>
        <div>
         <i @click="closed" class="iconfont iconCancelcontrol no-drag cursor-pointer"></i>
        </div>
        </div>`,
        created() {
        },
        beforeDestroy() {
        },
        methods: {
            closed() {
                this.$util.ipcRenderer.send('newWin-closed', this.$parent.conf.id)
            }
        }
    }
};