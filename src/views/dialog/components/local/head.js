'use strict';
module.exports = {
    lib: [],
    main: {
        props: {
            IComponentName: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                d_settings: null,
                d_exitprompt: null
            }
        },
        template: `<div class="head drag">
        <div>
        <span>{{$remote.app.name}} {{$remote.app.getVersion()}}</span>
        </div>
        <div class="no-drag">
        <i @click="settings" class="iconfont iconSettingscontrol no-drag cursor-pointer"></i>
        <i @click="system('mini')" class="iconfont iconMinus no-drag cursor-pointer"></i>
        <i @click="system('closed')" class="iconfont iconCancelcontrol no-drag cursor-pointer"></i>
        </div>
    </div>`,
        created() {
            console.log(this.$parent.$options.name, this.$options.name)
        },
        methods: {
            async settings() {
                this.$parent.dialogInit(
                    {
                        dialogName: '设置',
                        uniQueKey: 'settings',
                        returnPath: this.$options.name + '.d_settings'
                    }
                );
            },
            async system(channel) {
                if (channel !== 'closed') this.$ipcRenderer.send(channel);
                else {
                    this.$parent.dialogInit(
                        {
                            dialogName: '提示',
                            uniQueKey: 'exitprompt',
                            returnPath: this.$options.name + '.d_exitprompt'
                        }
                    );
                }
            }
        },
        watch: {
            d_settings(v) {
                console.log(v.test);
            }
        }
    }
};
