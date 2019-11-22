'use strict';
module.exports = {
    main: {
        data() {
            return {
                only: 'home',
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
            console.log('组件加载:' + this.only);
            this.r = setInterval(() => {
                console.log(this.date);
                this.date = new Date();
            }, 1000);
        },
        beforeDestroy() {
            clearInterval(this.r);
            console.log('组件卸载:' + this.only);
        },
        methods: {
            ssa() {
                this.$parent.componentName = 'login'
            }
        }
    }
};