'use strict';
const _ = require('./util');

class view {
    static getInstance() {
        if (!view.instance) view.instance = new view();
        return view.instance;
    }

    constructor() {
        this.config = require('./cfg/config.json');
    }

    /**
     * vue组件
     * 渲染进程
     * */
    async vue(Vue, el, conf) {
        const that = this;
        document.title = _.remote.app.name;
        Vue.prototype.$config = that.config;
        Vue.prototype.$util = _;
        Vue.prototype.$srl = (srl) => that.config.appUrl + srl;
        const view = async (key, view) => {
            let v = require(view);
            if (v.components) {
                v.main.components = {};
                for (let i of v.components) {
                    let {lib, main} = require(that.config['views'][el]['local'][i]);
                    v.main.components[i] = main;
                    v.lib = [...lib, ...v.lib];
                }
            }
            Vue.component(key, v.main);
            return v;
        };
        let viewsList = [];
        for (let i in that.config['views'][el]['global']) {
            let item = that.config['views'][el]['global'][i];
            viewsList.push(view(i, item));
        }
        await Promise.all(viewsList);
        let app_data = {
            IComponent: null,
            AppComponents: {},
            LoadedComponents: [],
            themeColor: that.config.themeColor
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
                    if (this.IComponent && this.IComponent.name === key) {
                        this.args = args;
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
                    await this.$util.loadCssJs(I_lib);
                    await this.$util.removeCssJs(R_lib);
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
                    if (size_ && size_.length > 0) {
                        Rectangle.width = size_[0];
                        Rectangle.height = size_[1];
                        Rectangle.x = this.$util.remote.getCurrentWindow().getPosition()[0] + ((this.$util.remote.getCurrentWindow().getBounds().width - size_[0]) / 2);
                        Rectangle.y = this.$util.remote.getCurrentWindow().getPosition()[1] + ((this.$util.remote.getCurrentWindow().getBounds().height - size_[1]) / 2);
                    } else {
                        Rectangle.x = this.$util.remote.getCurrentWindow().getPosition()[0] + ((this.$util.remote.getCurrentWindow().getBounds().width - Rectangle.width) / 2);
                        Rectangle.y = this.$util.remote.getCurrentWindow().getPosition()[1] + ((this.$util.remote.getCurrentWindow().getBounds().height - Rectangle.height) / 2);
                    }
                    Rectangle.width = parseInt(Rectangle.width);
                    Rectangle.height = parseInt(Rectangle.height);
                    Rectangle.x = parseInt(Rectangle.x);
                    Rectangle.y = parseInt(Rectangle.y);
                    this.$util.remote.getCurrentWindow().setBounds(Rectangle);
                    this.$args = args || null;
                    this.IComponent = this.AppComponents[key];
                },
                socketInit() {
                    this.$util.ipcRenderer.send('socketInit', this.$config.socketUrl);
                },
                socketMessage() {
                    this.$util.ipcRenderer.on('message', (event, req) => {
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
                    this.$util.ipcRenderer.send('socketSend', JSON.stringify({path, result, data}));
                },
                dialogInit(data) {
                    let args = {
                        width: this.$util.remote.getCurrentWindow().getBounds().width,
                        height: this.$util.remote.getCurrentWindow().getBounds().height,
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
                    this.$util.ipcRenderer.send('new-dialog', args);
                },
                dialogMessage() {
                    this.$util.ipcRenderer.on('newWin-rbk', (event, req) => {
                        let path = req.r.split('.');
                        if (path.length === 1) this[path[0]] = req.data;
                        if (path.length === 2) this.$refs[path[0]][path[1]] = req.data;
                        if (path.length === 3 && this.$refs[path[0]]) this.$refs[path[0]].$refs[path[1]][path[2]] = req.data;
                    })
                },
                dialogSend(args) {
                    this.$util.ipcRenderer.send('newWin-feedback', args);
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
                    else this.$util.swapArr(this.LoadedComponents, index1, 0);
                    setTimeout(() => this.eliminateComponent(), 1000);
                }
            }
        }
    }

}

module.exports = view.getInstance();