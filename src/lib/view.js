'use strict';
const {ipcRenderer, remote} = require('electron');
const log = require('./util/log');
const storage = require('./util/storage');
const general = require('./util/general');
const config = require('./cfg/config.json');

class view {
    static getInstance() {
        if (!view.instance) view.instance = new view();
        return view.instance;
    }

    constructor() {}

    /**
     * vue组件
     * 渲染进程
     * */
    async vue(Vue, el, conf) {
        Vue.prototype.$config = config;
        Vue.prototype.$remote = remote;
        Vue.prototype.$ipcRenderer = ipcRenderer;
        Vue.prototype.$general = general;
        Vue.prototype.$log = log;
        Vue.prototype.$storage = storage;
        const view = async (key, view) => {
            let v = require(view);
            if (v.components) {
                v.main.components = {};
                for (let i of v.components) {
                    let {lib, main} = require(config['views'][el]['local'][i]);
                    v.main.components[i] = main;
                    v.lib = [...lib, ...v.lib];
                }
            }
            Vue.component(key, v.main);
            return v;
        };
        let viewsList = [];
        for (let i in config['views'][el]['global']) {
            let item = config['views'][el]['global'][i];
            viewsList.push(view(i, item));
        }
        await Promise.all(viewsList);
        let app_data = {
            IComponent: null,
            AppComponents: {},
            LoadedComponents: [],
            themeColor: config.themeColor
        };
        if (conf) app_data.conf = conf;
        app_data.category = el;
        return {
            el: `#${el}`,
            data: app_data,
            async created() {
                switch (this.category) {
                    case 'app':
                        this.init('app-subject-home');
                        break;
                    case 'dialog':
                        this.init(this.conf.v);
                        break;
                    case 'menu':
                        this.init('menu-subject-home');
                }
            },
            updated() {
                // console.log(this.$refs[this.IComponent.name])
            },
            methods: {
                async init(componentName) {
                    this.socketMessage();
                    this.dialogMessage();
                    await this.switchComponent(componentName);
                },
                async switchComponent(key, args) {
                    if (this.IComponent?.name === key) {
                        this.args = null;
                        if (this.$refs[key]) this.$refs[key].args = args;
                        return;
                    }
                    let size_ = [], I_lib = [], R_lib = [];
                    if (this.LoadedComponents.indexOf(key) < 0) {
                        let vi = await view(key, this.$config['views'][this.category]['subject'][key]);
                        this.AppComponents[key] = {
                            keepAlive: vi.keepAlive,
                            size: vi.size,
                            lib: vi.lib,
                            name: key
                        };
                        if (vi.size) size_ = vi.size;
                        I_lib = vi.lib.concat();
                        if (this.LoadedComponents.length > 0) R_lib = this.IComponent.lib.concat();
                    } else {
                        size_ = this.AppComponents[key].size;
                        I_lib = this.AppComponents[key].lib.concat();
                        R_lib = this.IComponent.lib.concat();
                    }
                    let repeat_Lib = Array.from([...new Set([...I_lib, ...R_lib].filter(i => [...I_lib, ...R_lib].indexOf(i) !== [...I_lib, ...R_lib].lastIndexOf(i)))]);
                    for (let i = 0, len = repeat_Lib.length; i < len; i++) {
                        if (I_lib.indexOf(repeat_Lib[i]) > -1) delete I_lib[I_lib.indexOf(repeat_Lib[i])];
                        if (R_lib.indexOf(repeat_Lib[i]) > -1) delete R_lib[R_lib.indexOf(repeat_Lib[i])];
                    }
                    await this.$general.loadCssJs(I_lib);
                    await this.$general.removeCssJs(R_lib);
                    let Rectangle = {};
                    switch (this.category) {
                        case 'app':
                            Rectangle = {
                                width: this.$config.appSize[0],
                                height: this.$config.appSize[1]
                            }
                            break;
                        case 'dialog':
                            Rectangle = {
                                width: this.$config.dialogSize[0],
                                height: this.$config.dialogSize[1]
                            }
                            break;
                        case 'menu':
                            Rectangle = {
                                width: this.$config.menuSize[0],
                                height: this.$config.menuSize[1]
                            }
                    }
                    //根据页面参数修正窗口大小和位置
                    if (size_?.length > 0) {
                        Rectangle.width = size_[0];
                        Rectangle.height = size_[1];
                        Rectangle.x = this.$remote.getCurrentWindow().getPosition()[0] + ((this.$remote.getCurrentWindow().getBounds().width - size_[0]) / 2);
                        Rectangle.y = this.$remote.getCurrentWindow().getPosition()[1] + ((this.$remote.getCurrentWindow().getBounds().height - size_[1]) / 2);
                    } else {
                        Rectangle.x = this.$remote.getCurrentWindow().getPosition()[0] + ((this.$remote.getCurrentWindow().getBounds().width - Rectangle.width) / 2);
                        Rectangle.y = this.$remote.getCurrentWindow().getPosition()[1] + ((this.$remote.getCurrentWindow().getBounds().height - Rectangle.height) / 2);
                    }
                    Rectangle.width = parseInt(Rectangle.width);
                    Rectangle.height = parseInt(Rectangle.height);
                    Rectangle.x = parseInt(Rectangle.x);
                    Rectangle.y = parseInt(Rectangle.y);
                    this.$remote.getCurrentWindow().setBounds(Rectangle);
                    this.args = args;
                    this.IComponent = this.AppComponents[key];
                },
                socketInit() {
                    this.$ipcRenderer.send('socketInit', this.$config.socketUrl);
                },
                socketMessage() {
                    this.$ipcRenderer.on('message', (event, req) => {
                        switch (req.code) {
                            case 0:
                                let path = req.result.split('.');
                                if (path.length === 1) this[path[0]] = req.data;
                                if (path.length === 2) this.$refs[path[0]][path[1]] = req.data;
                                break;
                            case -1:
                                console.log(req.msg);
                                break;
                            default:
                                console.log('socketMessage...');
                                console.log(req)
                        }
                    })
                },
                socketSend(path, result, data) {
                    this.$ipcRenderer.send('socketSend', JSON.stringify({path, result, data}));
                },
                dialogInit(data) {
                    let args = {
                        width: this.$remote.getCurrentWindow().getBounds().width,
                        height: this.$remote.getCurrentWindow().getBounds().height,
                        name: data.name, //名称
                        v: data.v, //页面id
                        resizable: false,// 是否支持调整窗口大小
                        data: data.data, //数据
                        complex: false, //是否支持多窗口
                        parent: 'win', //父窗口
                        modal: true //父窗口置顶
                    };
                    if (this.conf) args.parent = this.conf.id;
                    if (data.v === 'message') args.complex = true;
                    if (data.r) args.r = data.r;
                    if (data.complex) args.complex = data.complex;
                    if (data.parent) args.parent = data.parent;
                    if (data.modal) args.modal = data.modal;
                    if (data.resizable) args.resizable = data.resizable;
                    this.$ipcRenderer.send('new-dialog', args);
                },
                dialogMessage() {
                    this.$ipcRenderer.on('newWin-rbk', (event, req) => {
                        let path = req.r.split('.');
                        if (path.length === 1) this[path[0]] = req.data;
                        if (path.length === 2) this.$refs[path[0]][path[1]] = req.data;
                        if (path.length === 3 && this.$refs[path[0]]) this.$refs[path[0]].$refs[path[1]][path[2]] = req.data;
                    })
                },
                dialogSend(args) {
                    this.$ipcRenderer.send('newWin-feedback', args);
                },
                eliminateComponent() {
                    let Components = Object.getOwnPropertyNames(this.$refs).sort();
                    let LoadedComponents = new Set([...this.LoadedComponents.concat()]);
                    if (Components.length > 15) {
                        let c = Array.from(new Set([...Components].filter(x => !new Set([...LoadedComponents]).has(x))));
                        for (let i of c) if (i.indexOf('global-') === -1 && this.$refs[i]) delete this.$refs[i];
                    }
                }
            },
            watch: {
                IComponent(val) {
                    let index1 = this.LoadedComponents.indexOf(val.name);
                    if (index1 < 0) this.LoadedComponents.unshift(val.name);
                    else this.$general.swapArr(this.LoadedComponents, index1, 0);
                    Vue.nextTick().then(() => this.eliminateComponent());
                }
            }
        }
    }

}

module.exports = view.getInstance();