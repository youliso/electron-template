'use strict';
const path = require('path');
module.exports = {
    lib: [],
    main: {
        data() {
            return {
                listData: []
            }
        },
        template: `<div class="subclass">
           <h4>settings</h4>
           <button @click="test">test</button>
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
                this.$parent.dialogSend({
                    r:this.$parent.conf.r,
                    data:{
                        test:'测试'
                    }
                })
            }
        }
    }
};