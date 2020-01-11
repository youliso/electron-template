'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {}
        },
        template: `<div class="head">
        <div>
        <span v-if="$parent.$el.id==='app'">{{util.remote.app.name}} {{util.remote.app.getVersion()}}</span>
        </div>
        <div>
        <i v-if="$parent.$el.id==='app'" class="iconfont iconSettingscontrol no-drag cursor-pointer"></i>
        <i v-if="$parent.$el.id==='app'" @click="system('mini')" class="iconfont iconMinus no-drag cursor-pointer"></i>
        <i @click="system('closed')" class="iconfont iconCancelcontrol no-drag cursor-pointer"></i>
        </div>
    </div>`,
        created() {
        },
        beforeDestroy() {
        },
        methods: {
            system(channel) {
                if (this.$parent.$el.id === 'dialog') window.close();
                else this.util.ipcRenderer.send(channel);
            }
        }
    }
};