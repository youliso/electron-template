'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {
            }
        },
        template: `<div class="head">
        <div>
          全局测试组件
        </div>
    </div>`,
        created() {
        },
        beforeDestroy() {
        },
        activated() {
            //开启缓存后 切换加载
        },
        deactivated() {
            //开启缓存后 切换卸载
        },
        methods: {
        },
        watch: {
        }
    }
};