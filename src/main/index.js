'use strict';
import Vue from './apis/vue.esm.browser.min.js';

const {remote, ipcRenderer} = require('electron');
const util = require('./apis/util');
const config = require('./cfg/config');
const views = () => {
    let components = {};
    for (let key in config.views) {
        let item = config.views[key];
        components[key] = {name: key};
        if (item.hasOwnProperty('keepAlive')) components[key].keepAlive = item.keepAlive;
        Vue.component(key, require(__dirname + '/views/' + item.v).main);
    }
    return components;
};
const components = views();
new Vue({
    el: '#app',
    data: {
        component: components['home'],
        components: components,
        util: util,
        db: util.accessIn(process.cwd() + '/data'),
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