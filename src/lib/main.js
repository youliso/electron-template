'use strict';
const {resolve} = require('path');
const {shell, app, BrowserWindow, globalShortcut, ipcMain, screen, Tray} = require('electron');
const _ = require('./util');

class main {
    static getInstance() {
        if (!main.instance) main.instance = new main();
        return main.instance;
    }

    constructor() {
        this.config = require('./cfg/config.json');
        this.Authorization = ""; //token
        this.win = null; //主窗口
        this.dialogs = []; //弹框组
        this.is_Dialogs = []; //弹框组状态
        this.appTray = null;//托盘
        this.menu = null; //托盘窗口
        this.socket = null;
        this.socketStatus = 0; // socket状态 0断开 1 连接
    }

    global(key) {
        return this[key];
    }

    browserWindowOpt(wh) {
        return {
            width: wh[0],
            height: wh[1],
            transparent: true,
            autoHideMenuBar: true,
            resizable: false,
            maximizable: false,
            frame: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                devTools: this.config.devTools,
                webSecurity: false
            }
        }
    }

    async createWindow() {
        this.win = new BrowserWindow(this.browserWindowOpt(this.config.appSize));
        //加载完毕后显示
        this.win.once('ready-to-show', () => this.win.show());
        //关闭后，这个事件会被触发。
        this.win.on('closed', () => this.win = null);
        //默认浏览器打开跳转连接
        this.win.webContents.on('new-window', (event, url, frameName, disposition, options) => {
            event.preventDefault();
            shell.openExternal(url);
        });
        // 打开开发者工具
        if (this.config.devTools) this.win.webContents.openDevTools();
        //注入初始化代码
        this.win.webContents.on("did-finish-load", () => {
            this.win.webContents.send('dataJsonPort', encodeURIComponent(JSON.stringify({el: 'app'})));
        });
        // 加载index.html文件
        await this.win.loadFile(resolve(__dirname, '../index.html'));
    }

    async createTray() {
        this.appTray = new Tray(resolve(__dirname, './static/icon/icon.ico'));
        this.appTray.setToolTip(app.name);
        let menu_point = null;
        this.appTray.on('mouse-move', (e, p) => menu_point = p);
        this.appTray.on('double-click', () => {
            for (let i of this.dialogs) if (i) i.show();
            this.win.show();
        })
        this.appTray.on('right-click', async (e, b) => {
            if (!menu_point) menu_point = b;
            if (this.menu) {
                this.menu.show();
                return;
            }
            // 创建浏览器窗口。
            let opt = this.browserWindowOpt(this.config.menuSize);
            opt.x = menu_point.x - 12;
            if ((opt.x + 300) > screen.getPrimaryDisplay().workAreaSize.width) opt.x = menu_point.x - (this.config.menuSize[0] - 13);
            opt.y = menu_point.y - (this.config.menuSize[1] - 13);
            this.menu = new BrowserWindow(opt);
            //window 加载完毕后显示
            this.menu.once('ready-to-show', () => this.menu.show());
            // 当 window 被关闭，这个事件会被触发。
            this.menu.on('closed', () => this.menu = null);
            //默认浏览器打开跳转连接
            this.menu.webContents.on('new-window', (event, url, frameName, disposition, options) => {
                event.preventDefault();
                shell.openExternal(url);
            });
            // 打开开发者工具
            if (this.config.devTools) this.menu.webContents.openDevTools();
            //隐藏menu任务栏状态
            this.menu.setSkipTaskbar(true);
            //menu最顶层
            this.menu.setAlwaysOnTop(true, 'screen-saver');
            //注入初始化代码
            this.menu.webContents.on("did-finish-load", () => {
                this.menu.webContents.send('dataJsonPort', encodeURIComponent(JSON.stringify({el: 'menu'})));
            });
            // 加载index.html文件
            await this.menu.loadFile(resolve(__dirname, '../index.html'));
        })
    }

    async createDialog(args) {
        let id = this.dialogs.length;
        for (let i of this.dialogs) {
            if (i && i.uniquekey === args.v && !i.complex) {
                i.focus();
                return;
            }
        }
        let opt = this.browserWindowOpt(this.config.dialogSize);
        if (typeof args.parent === 'string') {
            if (args.parent === 'win') opt.parent = this.win;
            opt.x = this.win.getPosition()[0] + ((this.win.getBounds().width - this.config.dialogSize[0]) / 2);
            opt.y = this.win.getPosition()[1] + ((this.win.getBounds().height - this.config.dialogSize[1]) / 2);
        } else if (typeof args.parent === 'number') {
            opt.parent = this.dialogs[args.parent];
            opt.x = this.dialogs[args.parent].getPosition()[0] + ((this.dialogs[args.parent].getBounds().width - this.config.dialogSize[0]) / 2);
            opt.y = this.dialogs[args.parent].getPosition()[1] + ((this.dialogs[args.parent].getBounds().height - this.config.dialogSize[1]) / 2);
        }
        opt.modal = args.modal;
        opt.resizable = args.resizable;
        this.dialogs[id] = new BrowserWindow(opt);
        this.dialogs[id].uniquekey = args.v;
        this.dialogs[id].complex = args.complex;
        //window加载完毕后显示
        this.dialogs[id].once('ready-to-show', () => this.dialogs[id].show());
        //window被关闭，这个事件会被触发。
        this.dialogs[id].on('closed', () => this.dialogs[id] = null);
        //默认浏览器打开跳转连接
        this.dialogs[id].webContents.on('new-window', (event, url, frameName, disposition, options) => {
            event.preventDefault();
            shell.openExternal(url);
        });
        // 打开开发者工具
        if (this.config.devTools) this.dialogs[id].webContents.openDevTools();
        //注入初始化代码
        this.dialogs[id].webContents.on("did-finish-load", () => {
            args.id = id;
            this.dialogs[id].webContents.send('dataJsonPort', encodeURIComponent(JSON.stringify({
                el: 'dialog',
                data: args
            })));
        });
        await this.dialogs[id].loadFile(resolve(__dirname, '../index.html'));
        this.is_Dialogs[id] = true;
    }

    async createSocket() {
        this.socket = require('socket.io-client')(this.config.socketUrl, {query: `Authorization=${global['App_Data'].Authorization}`});
        this.socket.on('connect', () => {
            this.win.webContents.executeJavaScript('console.log(\'[socket]connect\');');
            this.socketStatus = 1;
        });
        this.socket.on('message', (data) => {
            if (data.code === 11) {//刷新Token
                this.Authorization = data.data;
                return;
            }
            this.win.webContents.send('message', data);
            for (let i of this.dialogs) if (i) i.webContents.send('message', data);
        });
        this.socket.on('error', (msg) => {
            this.win.webContents.send('data', {code: -2, msg});
        });
        this.socket.on('disconnect', () => {
            this.socketStatus = 0;
            this.win.webContents.executeJavaScript('console.log(\'[socket]disconnect\');');
            setTimeout(() => {
                if (this.socketStatus === 0) this.socket.open()
            }, 1000 * 60 * 3)
        });
        this.socket.on('close', () => {
            this.win.webContents.send('data', {code: -1, msg: '[socket]close'});
        });
    }

    async update() {
        let message = {
            error: {code: 0, msg: '检查更新出错'},
            checking: {code: 1, msg: '正在检查更新'},
            updateAva: {code: 2, msg: '检测到新版本，正在下载'},
            updateNotAva: {code: 3, msg: '现在使用的就是最新版本，不用更新'}
        };
        // 这里的URL就是更新服务器的放置文件的地址
        const {autoUpdater} = require("electron-updater");
        autoUpdater.setFeedURL(this.config.updateFileUrl);
        autoUpdater.on('error', (error) => {
            this.win.webContents.send('update_message', message.error);
        });
        autoUpdater.on('checking-for-update', () => {
            this.win.webContents.send('update_message', message.checking);
        });
        autoUpdater.on('update-available', (info) => {
            this.win.webContents.send('update_message', message.updateAva);
        });
        autoUpdater.on('update-not-available', (info) => {
            this.win.webContents.send('update_message', message.updateNotAva);
        });
        // 更新下载进度事件
        autoUpdater.on('download-progress', (progressObj) => {
            this.win.webContents.send('downloadProgress', progressObj)
        })
        // 下载完成事件
        autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
            ipcMain.on('isUpdateNow', (e, arg) => {
                // 关闭程序安装新的软件
                autoUpdater.quitAndInstall();
            })
            // 通知渲染进程现在完成
            this.win.webContents.send('isUpdateNow')
        });
        //执行自动更新检查
        try {
            await autoUpdater.checkForUpdates();
        } catch (e) {
            _.log().error(e);
        }
    }

    async init() {
        app.allowRendererProcessReuse = true;
        if (!app.requestSingleInstanceLock()) {
            app.quit();
        } else {
            app.on('second-instance', (event, argv, workingDirectory) => {
                // 当运行第二个实例时,将会聚焦到myWindow这个窗口
                if (this.win) {
                    if (this.win.isMinimized()) this.win.restore();
                    this.win.focus();
                }
            })
        }
        app.whenReady().then(() => {
            this.createWindow();
            this.createTray();
        });
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        })
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        })
        //获得焦点时发出
        app.on('browser-window-focus', () => {
            //关闭刷新
            globalShortcut.register('CommandOrControl+R', () => {
            });
        });
        //失去焦点时发出
        app.on('browser-window-blur', () => {
            // 注销快捷键
            globalShortcut.unregister('CommandOrControl+R');
        });
        //协议调起
        let args = [];
        if (!app.isPackaged) args.push(resolve(process.argv[1]));
        args.push('--');
        app.setAsDefaultProtocolClient(app.name, process.execPath, args);
    }

    async ipc() {
        /**
         * 主体
         * */
        //关闭
        ipcMain.on('closed', (event, args) => {
            for (let i of this.dialogs) if (i) i.close();
            this.dialogs = [];
            this.is_Dialogs = [];
            if (this.menu) this.menu.close();
            this.win.close();
        });
        //隐藏
        ipcMain.on('hide', (event, args) => {
            for (let i of this.dialogs) if (i) i.hide();
            this.win.hide();
        });
        //显示
        ipcMain.on('show', (event, args) => {
            for (let i of this.dialogs) if (i) i.show();
            this.win.show();
        });
        //最小化
        ipcMain.on('mini', () => {
            for (let i of this.dialogs) if (i) i.minimize();
            this.win.minimize();
        });
        //复原
        ipcMain.on('restore', () => {
            for (let i of this.dialogs) if (i) i.restore();
            this.win.restore();
        });
        //重载
        ipcMain.on('reload', () => {
            for (let i of this.dialogs) if (i) i.reload();
            this.win.reload();
        });
        //重启
        ipcMain.on('relaunch', () => {
            app.relaunch({args: process.argv.slice(1)});
        });

        /**
         * 弹框
         * */
        //创建
        ipcMain.on('new-dialog', (event, args) => {
            this.createDialog(args);
        });
        //反馈
        ipcMain.on('newWin-feedback', (event, args) => {
            this.win.webContents.send('newWin-rbk', args);
        });
        //关闭
        ipcMain.on('newWin-closed', (event, id) => {
            this.is_Dialogs[id] = false;
            this.dialogs[id].close();
            delete this.dialogs[id];
            let is = true;
            for (let i = 0, len = this.is_Dialogs.length; i < len; i++) if (this.is_Dialogs[i]) is = false;
            if (is) {
                this.dialogs = [];
                this.is_Dialogs = [];
            }
        });
        //最小化
        ipcMain.on('newWin-mini', (event, id) => {
            this.dialogs[id].minimize();
        });

        /**
         * socket
         * */
        //初始化
        ipcMain.on('socketInit', async (event, args) => {
            if (!this.socket) await this.createSocket();
        });
        //重新连接
        ipcMain.on('socketReconnection', async (event, args) => {
            if (!this.socket) this.socket.open();
        });
        //发消息
        ipcMain.on('socketSend', async (event, args) => {
            if (this.socket) this.socket.send(args);
        });

        /**
         * update
         * */
        //删除更新文件
        ipcMain.on('delUpdateFile', () => {
            _.delDir('../kl-updater');
        });
        //检查更新
        ipcMain.on('update', () => {
            this.update();
        });

        /**
         * global
         * */
        ipcMain.on('global', (event, args) => {
            return this[args]
        });
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

module.exports = main.getInstance();