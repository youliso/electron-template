'use strict';
import Vue from './apis/vue.esm.browser.min.js';

const fs = require('fs');
const {remote, ipcRenderer} = require('electron');
const util = require('./apis/util');
const pages = () => {
    fs.readdirSync(__dirname + '/views').forEach((view) => {
        let v = require(__dirname + '/views/' + view);
        if (v.main) Vue.component(v.main.data().only, v.main);
    });
};
pages();

new Vue({
    el: '#app',
    data: {
        componentName: 'home',
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