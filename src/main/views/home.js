'use strict';
module.exports = {
    main: {
        data() {
            return {
                only: 'home',
                keepAlive: true,
                count: 0,
                date: new Date()
            }
        },
        template: `<div class="subclass">

        <h1>{{only}}</h1>
        <h4>{{date}}</h4>
        <button @click="ssa">qyy</button>  
        
        </div>`,
        created() {
            //首次加载
            console.log(this.only+':created');
            this.r = setInterval(() => {
                this.date = new Date();
            }, 1000);
        },
        beforeDestroy() {
            //卸载
            console.log(this.only+':beforeDestroy');
            clearInterval(this.r);
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
                this.$parent.component = this.$parent.components['login']
            }
        }
    }
};