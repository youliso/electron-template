'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {
                count: 0
            }
        },
        template: `<div class="subclass">

        <button @click="ssa">切换到首页</button> 
        
        </div>`,
        created() {
            //首次加载
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
            async ssa() {
                await this.$parent.switchComponent('app-home');
            }
        }
    }
};