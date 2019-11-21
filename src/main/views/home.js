'use strict';
exports.home = {
    data() {
        return {
            count: 0,
            name:'homes'
        }
    },
    template: '<button v-on:click="ssa">{{$parent.remote.app.name}}</button>',
    methods: {
        ssa(){
            this.$parent.componentName ='login'
        }
    }
};