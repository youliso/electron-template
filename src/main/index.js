'use strict';
import Vue from './apis/vue.esm.browser.min.js';

const {remote, ipcRenderer} = require('electron');
const util = require('./apis/util');
const fetch = require('./apis/fetch');
const config = require('./cfg/config');
Vue.prototype.util = util;
Vue.prototype.fetch = new fetch(config.url);
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
        db: this.util.accessIn(process.cwd() + '/data'),
        remote: remote,
        seenHead: true
    },
    created() {
        console.log('init');
    },
    methods: {
        system(channel) {
            ipcRenderer.send(channel);
        }
    }
});