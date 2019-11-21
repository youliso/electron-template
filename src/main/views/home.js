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
        template: `<div class="content">

        <h1>{{only}}</h1>
        <h4>{{date}}</h4>
        <button @click="ssa">qyy</button>  
        
        </div>`,
        created() {
            console.log('当前页面' + this.only);
            setInterval(() => {
                this.date = new Date();
            }, 1000)
        },
        methods: {
            ssa() {
                this.$parent.componentName = 'login'
            }
        }
    }
};