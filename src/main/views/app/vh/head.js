'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {}
        },
        template: `<div class="head">
        <div>
        <span>{{$util.remote.app.name}} {{$util.remote.app.getVersion()}}</span>
        </div>
        <div>
        <i @click="settings" class="iconfont iconSettingscontrol no-drag cursor-pointer"></i>
        <i @click="system('mini')" class="iconfont iconMinus no-drag cursor-pointer"></i>
        <i @click="system('closed')" class="iconfont iconCancelcontrol no-drag cursor-pointer"></i>
        </div>
    </div>`,
        created() {
        },
        beforeDestroy() {
        },
        methods: {
            settings(){
                this.$util.ipcRenderer.send('newWin', {name: '设置', v: 'dialog-test', width: 400, height: 200})
            },
            system(channel) {
                this.$util.ipcRenderer.send(channel);
            }
        }
    }
};