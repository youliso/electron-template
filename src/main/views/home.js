'use strict';
module.exports = {
    main: {
        data() {
            return {
                only: 'home',
                count: 0
            }
        },
        template: '<button @click="ssa">{{$parent.remote.app.name}}</button>',
        created() {
            let test = require('./test');
            new test().ustr()
        },
        methods: {
            ssa() {
                this.$parent.componentName = 'login'
            }
        }
    }
};