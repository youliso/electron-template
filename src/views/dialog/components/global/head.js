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
            return {}
        },
        template: `<div class="head drag">
        <div>
        <span>{{$parent.conf.dialogName}}</span>
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
                this.$ipcRenderer.send('newWin-closed', this.$parent.conf.id)
            }
        }
    }
};
