'use strict';
module.exports = {
    main: {
        data() {
            return {
                only: 'login',
                count: 0
            }
        },
        template: `<div class="subclass">

        <h1>{{only}}</h1>
        <button @click="ssa">qyy</button> 
        
        </div>`,
        created() {
            console.log('当前页面' + this.only)
        },
        methods: {
            ssa() {
                this.$parent.componentName = 'home'
            }
        }
    }
};