'use strict';
exports.home = {
    data() {
        return {
            count: 0,
            name:'homes'
        }
    },
    template: '<button v-on:click="ssa">You clicked me times.</button>',
    methods: {
        ssa(){
            this.$parent.componentName ='login'
        }
    }
};