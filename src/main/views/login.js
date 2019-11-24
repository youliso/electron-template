'use strict';
module.exports = {
    main: {
        data() {
            return {
                only: 'login',
                keepAlive: false,
                count: 0
            }
        },
        template: `<div class="subclass">

        <h1>{{only}}</h1>
        <button @click="ssa">qyy</button> 
        
        </div>`,
        created() {
            //首次加载
            console.log(this.only+':created');
        },
        beforeDestroy() {
            //卸载
            console.log(this.only+':beforeDestroy');
        },
        activated() {
            //开启缓存后 切换加载
            console.log(this.only+':activated');
        },
        deactivated() {
            //开启缓存后 切换卸载
            console.log(this.only+':deactivated');
        },
        methods: {
            ssa() {
                this.$parent.component = this.$parent.components['home']
            }
        }
    }
};