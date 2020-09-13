import {ipcRenderer,remote} from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './css/main.css';


class Demo {
    name: string = "";

    constructor() {
        this.name = "Hello sssssawfws";
    }

    render(e: string) {
        ReactDOM.render(
            <div>
                {e}
            </div>,
            document.querySelector('#app')
        )
    }
}

ipcRenderer.on('dataJsonPort', async (event, e) => {
    new Demo().render(decodeURIComponent(e));
    remote.getCurrentWindow().show();
})

