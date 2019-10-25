'use strict';

class home {
    constructor(view, data) {
        this.data = data;
        view.innerHTML = this.View();
        this.Event();
    }

    View() {
        return `
           <div class="content-head drag">${remote.app.getName()} ${remote.app.getVersion()}</div>
           <div class="content-cont">
                     Hello world
           </div>
           `;
    }

    Event() {
        //function
        console.log(this.data);
        console.log(document);
    }
}

module.exports = {
    init(view, data) {
        new home(view, data);
    }
};