'use strict';
const execSync = require('child_process').execSync;
module.exports = {
    keepAlive: true,
    size: [],
    lib: [
        'views/app/home/home.css'
    ],
    components: [
        'app-local-head'
    ],
    main: {
        data() {
            return {
                listData: [1]
            }
        },
        template: `
          <div class="subclass no-drag" style="padding: 10px;">
             <app-local-head v-bind:IComponentName="$options.name" ref="app-local-head"></app-local-head>
             <h4>首页</h4>
             <input id="test" class="input" value="test">
             <select class="select"><option>123</option></select>
             <button @click="test" class="button yellow">获取软件版本号</button>
             <button @click="$parent.switchComponent('app-subject-info')" class="button green">详情</button>
          </div>
        `,
        async created() {
            console.log(`${this.$options.name}: created`);
        },
        beforeDestroy() {
            //卸载
            console.log(`${this.$options.name}: beforeDestroy`)
        },
        activated() {
            //开启缓存后 切换加载
            console.log(`${this.$options.name}: activated`,document.getElementById('test').value)
        },
        deactivated() {
            //开启缓存后 切换卸载
            console.log(`${this.$options.name}: deactivated`)
        },
        beforeUpdate() {
            console.log(`${this.$options.name}: beforeUpdate`)
        },
        methods: {
            async test() {
                let req = await this.$util.remote.dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: [{name: '可运行文件', extensions: ['exe']}]
                });
                if (!req.canceled) {
                    this.getV(req.filePaths[0].split('\\').join('\\\\'))
                }
            },
            async getV(v) {
                let name = v.substring(v.lastIndexOf('\\\\') + 2);
                let data = execSync(`wmic datafile where "Name= '${v}'" get Version`);
                data = this.$util.trim(data.slice(7).toString());
                this.$parent.dialogInit({
                    name: '提示',
                    v: 'dialog-subject-message',
                    data: {
                        text: name + '版本号：' + (data === '' ? '此应用未设置版本号' : data)
                    }
                });
            }
        },
        watch: {
            statusCode(v) {
                console.log('statusCode')
            }
        }
    }
};
