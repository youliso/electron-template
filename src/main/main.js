'use strict';
const {
    shell,
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    Menu,
    Tray
} = require('electron');
//禁用网站实例覆盖
app.allowRendererProcessReuse = true;
const path = require('path');
const gotTheLock = app.requestSingleInstanceLock();
const win_w = 950, win_h = 600;
let win = null, appTray = null, socket = null;
global.App_Data = {
    Authorization: "",
    win_w: win_w,
    win_h: win_h
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
    let opt = WinOpt(win_w, win_h);
    win = new BrowserWindow(opt);

    //默认浏览器打开跳转连接
    win.webContents.on('new-window', (event, url, frameName, disposition, options) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    // 打开开发者工具
    if (opt.webPreferences.devTools) win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        win = null
    });
    // 加载index.html文件
    win.loadFile('index.html');
    //托盘
    appTray = new Tray(path.join(__dirname, './icon.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示', click() {
                win.show();
            }
        },
        {
            label: '退出', click() {
                app.quit();
            }
        }
    ]);
    appTray.setToolTip(app.name);
    appTray.setContextMenu(contextMenu);
    appTray.on('double-click', () => {
        win.show();
    })
};
app.whenReady().then(createWindow);
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

//新窗口
let dialogs = [], is_Dialogs = [];
ipcMain.on('new-dialog', (event, args) => {
    let id = dialogs.length;
    for (let i of dialogs) {
        if (i && i.uniquekey === args.v && !i.complex) {
            i.focus();
            return;
        }
    }
    let opt = WinOpt(args.width, args.height);
    opt.x = win.getPosition()[0] + ((win.getBounds().width - args.width) / 2);
    opt.y = win.getPosition()[1] + ((win.getBounds().height - args.height) / 2);
    opt.parent = win;
    dialogs[id] = new BrowserWindow(opt);
    dialogs[id].uniquekey = args.v;
    dialogs[id].complex = args.complex || false;
    // 打开开发者工具
    if (opt.webPreferences.devTools) dialogs[id].webContents.openDevTools();
    dialogs[id].loadFile('dialog.html');
    //注入初始化代码
    dialogs[id].webContents.on("did-finish-load", () => {
        args.id = id;
        dialogs[id].webContents.send('dataJsonPort', encodeURIComponent(JSON.stringify(args)));
    });
    is_Dialogs[id] = true;
});

//新窗口 反馈
ipcMain.on('newWin-feedback', (event, args) => {
    win.webContents.send('newWin-rbk', args);
});

//新窗口 关闭
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

//关闭
ipcMain.on('closed', (event, args) => {
    for (let i of dialogs) if (i) i.close();
    win.close();
});

//隐藏
ipcMain.on('hide', (event, args) => {
    for (let i of dialogs) if (i) i.close();
    dialogs = [];
    is_Dialogs = [];
    win.hide();
});

//最小化
ipcMain.on('mini', () => {
    win.minimize();
});

//复原
ipcMain.on('restore', () => {
    win.restore();
});

//重载
ipcMain.on('reload', () => {
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