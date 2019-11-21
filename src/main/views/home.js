'use strict';
module.exports = {
    main: {
        data() {
            return {
                only: 'home',
                count: 0,
                date: new Date(),
                t: null
            }
        },
        template: `<div class="subclass">

        <h1>{{only}}</h1>
        <h4>{{date}}</h4>
        <button @click="ssa">qyy</button>  
        
        </div>`,
        created() {
            console.log('当前页面' + this.only);
            let t = setInterval(() => {
                console.log(1);
                this.date = new Date();
            }, 1000);
            this.r = t;
        },
        beforeDestroy() {
            clearInterval(this.r);
        },
        methods: {
            ssa() {
                this.$parent.componentName = 'login'
            }
        }
    }
};