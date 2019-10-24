'use strict';

class home {
    constructor(view, data) {
        view.innerHTML = this.View(data.v);
        this.Event(data.e);
    }

    View(app) {
        return `
           <div class="content-head drag">${app.getName()} ${app.getVersion()}</div>
           <div class="content-cont">
                     Hello world
           </div>
           `;
    }

    Event(obj) {
        //function
        console.log(obj);
        console.log('function');
    }
}

module.exports = home;