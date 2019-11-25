'use strict';
module.exports = {
    main: {
        data() {
            return {
                count: 0
            }
        },
        template: `<div class="subclass">

        <button @click="ssa">qyy</button> 
        
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
            ssa() {
                this.$parent.component = this.$parent.components['app-home']
            }
        }
    }
};