'use strict';
const {
    shell,
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    screen,
    Tray
} = require('electron');
//禁用网站实例覆盖
app.allowRendererProcessReuse = true;
const fs = require('fs');
const path = require('path');
const gotTheLock = app.requestSingleInstanceLock();
const config = require('./config.json');
let win = null, menu = null, appTray = null, socket = null;
global.App_Data = {
    Authorization: "",
    appSize: config.appSize,
    dialogSize: config.dialogSize,
    menuSize: config.menuSize
};

const WinOpt = (width, height) => {
    return {
        width: width,
        height: height,
        transparent: true,
        autoHideMenuBar: true,
        resizable: false,
        maximizable: false,
        frame: false,
        show: false,
        // backgroundColor: config.themeColor,
        webPreferences: {
            nodeIntegration: true,
            devTools: true,
            webSecurity: false
        }
    }
};

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, argv, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus()
        }
    })
}

const createWindow = () => {
    // 创建浏览器窗口。
    let opt = WinOpt(global.App_Data['appSize'][0], global.App_Data['appSize'][1]);
    win = new BrowserWindow(opt);
    //window 加载完毕后显示
    win.once('ready-to-show', () => win.show());
    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => win = null);
    //默认浏览器打开跳转连接
    win.webContents.on('new-window', (event, url, frameName, disposition, options) => {
        event.preventDefault();
        shell.openExternal(url);
    });
    // 打开开发者工具
    if (opt.webPreferences.devTools) win.webContents.openDevTools();
    // 加载index.html文件
    win.loadFile(path.join(__dirname, './index.html'));
};

/**
 * 托盘
 * */
const createTray = () => {
    appTray = new Tray(path.join(__dirname, './icon.ico'));
    appTray.setToolTip(app.name);
    let menu_point = null;
    appTray.on('mouse-move', (e, p) => menu_point = p);
    appTray.on('double-click', () => {
        for (let i of dialogs) if (i) i.show();
        win.show();
    })
    appTray.on('right-click', (e, b) => {
        if (!menu_point) menu_point = b;
        if (menu) {
            menu.show();
            return;
        }
        // 创建浏览器窗口。
        let opt = WinOpt(global.App_Data['menuSize'][0], global.App_Data['menuSize'][1]);
        opt.x = menu_point.x - 12;
        if ((opt.x + 300) > screen.getPrimaryDisplay().workAreaSize.width) opt.x = menu_point.x - (global.App_Data['menuSize'][0] - 13);
        opt.y = menu_point.y - (global.App_Data['menuSize'][1] - 13);
        menu = new BrowserWindow(opt);
        //window 加载完毕后显示
        menu.once('ready-to-show', () => menu.show());
        // 当 window 被关闭，这个事件会被触发。
        menu.on('closed', () => menu = null);
        //默认浏览器打开跳转连接
        menu.webContents.on('new-window', (event, url, frameName, disposition, options) => {
            event.preventDefault();
            shell.openExternal(url);
        });
        // 打开开发者工具
        if (opt.webPreferences.devTools) menu.webContents.openDevTools();
        //隐藏menu任务栏状态
        menu.setSkipTaskbar(true);
        //menu最顶层
        menu.setAlwaysOnTop(true, 'screen-saver');
        // 加载index.html文件
        menu.loadFile(path.join(__dirname, './menu.html'));
    })
}
/**
 * 弹框窗口
 * */
let dialogs = [], is_Dialogs = [];
const createDialog = (args) => {
    let id = dialogs.length;
    for (let i of dialogs) {
        if (i && i.uniquekey === args.v && !i.complex) {
            i.focus();
            return;
        }
    }
    let opt = WinOpt(global.App_Data['dialogSize'][0], global.App_Data['dialogSize'][1]);
    if (typeof args.parent === 'string') {
        if (args.parent === 'win') opt.parent = win;
        opt.x = win.getPosition()[0] + ((win.getBounds().width - global.App_Data['dialogSize'][0]) / 2);
        opt.y = win.getPosition()[1] + ((win.getBounds().height - global.App_Data['dialogSize'][1]) / 2);
    } else if (typeof args.parent === 'number') {
        opt.parent = dialogs[args.parent];
        opt.x = dialogs[args.parent].getPosition()[0] + ((dialogs[args.parent].getBounds().width - global.App_Data['dialogSize'][0]) / 2);
        opt.y = dialogs[args.parent].getPosition()[1] + ((dialogs[args.parent].getBounds().height - global.App_Data['dialogSize'][1]) / 2);
    }
    opt.modal = args.modal;
    opt.resizable = args.resizable;
    dialogs[id] = new BrowserWindow(opt);
    dialogs[id].uniquekey = args.v;
    dialogs[id].complex = args.complex;
    //window加载完毕后显示
    dialogs[id].once('ready-to-show', () => dialogs[id].show());
    //window被关闭，这个事件会被触发。
    dialogs[id].on('closed', () => dialogs[id] = null);
    //默认浏览器打开跳转连接
    dialogs[id].webContents.on('new-window', (event, url, frameName, disposition, options) => {
        event.preventDefault();
        shell.openExternal(url);
    });
    // 打开开发者工具
    if (opt.webPreferences.devTools) dialogs[id].webContents.openDevTools();
    dialogs[id].loadFile(path.join(__dirname, './dialog.html'));
    //注入初始化代码
    dialogs[id].webContents.on("did-finish-load", () => {
        args.id = id;
        dialogs[id].webContents.send('dataJsonPort', encodeURIComponent(JSON.stringify(args)));
    });
    is_Dialogs[id] = true;
}
app.whenReady().then(() => {
    createWindow();
    createTray();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
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
//弹框 创建
ipcMain.on('new-dialog', (event, args) => createDialog(args));

//弹框 反馈
ipcMain.on('newWin-feedback', (event, args) => {
    win.webContents.send('newWin-rbk', args);
});

//弹框 关闭
ipcMain.on('newWin-closed', (event, id) => {
    is_Dialogs[id] = false;
    dialogs[id].close();
    delete dialogs[id];
    let is = true;
    for (let i = 0, len = is_Dialogs.length; i < len; i++) if (is_Dialogs[i]) is = false;
    if (is) {
        dialogs = [];
        is_Dialogs = [];
    }
});

//弹框 最小化
ipcMain.on('newWin-mini', (event, id) => {
    dialogs[id].minimize();
});

//关闭
ipcMain.on('closed', (event, args) => {
    for (let i of dialogs) if (i) i.close();
    dialogs = [];
    is_Dialogs = [];
    if (menu) menu.close();
    win.close();
});

//隐藏
ipcMain.on('hide', (event, args) => {
    for (let i of dialogs) if (i) i.hide();
    win.hide();
});

//显示
ipcMain.on('show', (event, args) => {
    for (let i of dialogs) if (i) i.show();
    win.show();
});

//最小化
ipcMain.on('mini', () => {
    for (let i of dialogs) if (i) i.minimize();
    win.minimize();
});

//复原
ipcMain.on('restore', () => {
    for (let i of dialogs) if (i) i.restore();
    win.restore();
});

//重载
ipcMain.on('reload', () => {
    for (let i of dialogs) if (i) i.reload();
    win.reload();
});

//重启
ipcMain.on('relaunch', () => {
    app.relaunch({args: process.argv.slice(1)});
});

//协议调起
const args = [];
if (!app.isPackaged) {
    args.push(path.resolve(process.argv[1]));
}
args.push('--');
const PROTOCOL = app.name;
app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args);

//socket 三次
let socketStatus = 0;
const socketInit = (address) => {
    socket = require('socket.io-client')(address, {query: `Authorization=${global['App_Data'].Authorization}`});
    socket.on('connect', () => {
        win.webContents.executeJavaScript('console.log(\'[socket]connect\');');
        socketStatus = 1;
    });
    socket.on('message', (data) => {
        if (data.code === 11) {//刷新Token
            global['App_Data'].Authorization = data.data;
            return;
        }
        win.webContents.send('message', data);
        for (let i of dialogs) if (i) i.webContents.send('message', data);
    });
    socket.on('error', (msg) => {
        win.webContents.send('data', {code: -2, msg});
    });
    socket.on('disconnect', () => {
        socketStatus = 0;
        win.webContents.executeJavaScript('console.log(\'[socket]disconnect\');');
        setTimeout(() => {
            if (socketStatus === 0) socket.open()
        }, 1000 * 60 * 3)
    });
    socket.on('close', () => {
        win.webContents.send('data', {code: -1, msg: '[socket]close'});
    });
};

//socket初始化
ipcMain.on('socketInit', async (event, address) => {
    if (!socket) socketInit(address);
});

//socket重新连接
ipcMain.on('socketInit', async (event, address) => {
    if (!socket) socket.open();
});

//socket发消息
ipcMain.on('socketSend', async (event, args) => {
    socket.send(args)
});


/**
 * 自动更新
 * */

// 注意这个autoUpdater不是electron中的autoUpdater
const {autoUpdater} = require("electron-updater")
// 通过main进程发送事件给renderer进程，提示更新信息
const sendUpdateMessage = (data) => {
    win.webContents.send('update_message', data)
}
//删除文件
const delDir = (path) => {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
const updateHandle = () => {
    let message = {
        error: {code: 0, msg: '检查更新出错'},
        checking: {code: 1, msg: '正在检查更新'},
        updateAva: {code: 2, msg: '检测到新版本，正在下载'},
        updateNotAva: {code: 3, msg: '现在使用的就是最新版本，不用更新'}
    };
    // 这里的URL就是更新服务器的放置文件的地址
    autoUpdater.setFeedURL(config.updateFileUrl);
    autoUpdater.on('error', (error) => {
        sendUpdateMessage(message.error)
    });
    autoUpdater.on('checking-for-update', () => {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', (info) => {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', (info) => {
        sendUpdateMessage(message.updateNotAva)
    });
    // 更新下载进度事件
    autoUpdater.on('download-progress', (progressObj) => {
        win.webContents.send('downloadProgress', progressObj)
    })
    // 下载完成事件
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
        ipcMain.on('isUpdateNow', (e, arg) => {
            // 关闭程序安装新的软件
            autoUpdater.quitAndInstall();
        })
        // 通知渲染进程现在完成
        win.webContents.send('isUpdateNow')
    });

    //执行自动更新检查
    autoUpdater.checkForUpdates().catch(e => console.log(e));
}

//删除更新文件
ipcMain.on('del_update', () => {
    delDir('../kl-updater');
});

//检查更新
ipcMain.on('updateHandle', () => {
    updateHandle();
});
