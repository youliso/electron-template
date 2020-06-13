'use strict';
const execSync = require('child_process').execSync;
module.exports = {
    keepAlive: true,
    size: [],
    components: [
        'head'
    ],
    lib: [
        'css/views/home.css'
    ],
    main: {
        data() {
            return {
                listData: []
            }
        },
        template: `<div class="no-drag content">
        <app-head v-bind:IComponentName="$options.name" ref="app-head"></app-head>
          <div class="subclass">
             <h4>首页</h4>
             <button @click="test" class="button">获取软件版本号</button>
              <button @click="$parent.switchComponent('info')" class="button">详情</button>
          </div>
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
                    v: 'message',
                    data: {
                        text: name + '版本号：' + (data === '' ? '此应用未设置版本号' : data)
                    }
                });
            }
        }
    }
};