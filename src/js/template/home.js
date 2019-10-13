'use strict';
const {app} = require('electron').remote;
const head = ()=>{
    return `<div class="content-head drag">${app.getName()} ${app.getVersion()}</div>`;
};
const Home = () => {
    return `
           ${head()}
           <div class="content-cont">
             ${new Date()}
           </div>
           `;
};
module.exports = {
    Home
};
