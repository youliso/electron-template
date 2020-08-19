'use strict';
const execSync = require('child_process').execSync;
module.exports = {
    keepAlive: false,
    size:[],
    lib: [],
    components: [
        'app-local-head'
    ],
    main: {
        data() {
            return {
                listData: []
            }
        },
        template: `
          <div class="subclass no-drag" style="padding: 10px;">
             <app-local-head v-bind:IComponentName="$options.name" ref="app-local-head"></app-local-head>
             <h4>详情</h4>
             <button @click="$parent.switchComponent('app-subject-home')" class="button">返回</button>
          </div>`,
        async created() {
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
