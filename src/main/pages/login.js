'use strict';
exports.login = {
    data() {
        return {
            count: 0,
            name:'logins'
        }
    },
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
};