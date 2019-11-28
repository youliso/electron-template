'use strict';
import Vue from './apis/vue.esm.browser.min.js';

const {remote, ipcRenderer} = require('electron');
const util = require('./apis/util');
const config = require('./cfg/config');
Vue.prototype.remote = remote;
Vue.prototype.ipcRenderer = ipcRenderer;
Vue.prototype.util = util;
Vue.prototype.db = util.accessIn(process.cwd() + '/data');
const views = () => {
    let components = {};
    for (let key in config.views) {
        let item = config.views[key];
        components[key] = item;
        components[key].name = key;
        Vue.component(key, require(__dirname + '/views/' + item.v).main);
    }
    return components;
};
const components = views();
new Vue({
    el: '#app',
    data: {
        component: components['app-home'],
        components: components,
        seenHead: true
    },
    created() {
        console.log('init');
    },
    methods: {
        system(channel) {
            this.ipcRenderer.send(channel);
        }
    }
});