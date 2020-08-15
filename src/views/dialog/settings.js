'use strict';
const path = require('path');
module.exports = {
    size: [480, 230],
    lib: [],
    main: {
        data() {
            return {
                listData: []
            }
        },
        template: `<div class="subclass">
           <button @click="test" class="button no-drag">test</button>
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
            test() {
                this.$parent.dialogInit({
                    name: '提示',
                    v: 'dialog-subject-message',
                    data: {
                        text: '123'
                    }
                });
                this.$parent.dialogSend({
                    r: this.$parent.conf.r,
                    data: {
                        test: '测试'
                    }
                })
            }
        }
    }
};