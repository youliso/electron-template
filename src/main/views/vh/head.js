'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {}
        },
        template: `<div v-if="seenHead" class="head">
        <i @click="system('setting')" class="iconfont iconSettingscontrol no-drag cursor-pointer"></i>
        <i @click="system('mini')" class="iconfont iconMinus no-drag cursor-pointer"></i>
        <i @click="system('closed')" class="iconfont iconCancelcontrol no-drag cursor-pointer"></i>
    </div>`,
        created() {
        },
        beforeDestroy() {
        },
        methods: {}
    }
};