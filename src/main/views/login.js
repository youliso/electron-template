'use strict';
module.exports = {
    main: {
        data() {
            return {
                only: 'login',
                count: 0
            }
        },
        template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>',
        created() {
            console.log('当前页面' + this.only)
        }
    }
};