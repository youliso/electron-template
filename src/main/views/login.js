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
            console.log('a is: ' + this.only)
        }
    }
};