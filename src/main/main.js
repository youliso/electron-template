'use strict';
const {
    shell,
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain
} = require('electron');
//禁用网站实例覆盖
app.allowRendererProcessReuse = true;
const webSocket = require('ws');
const path = require('path');
const gotTheLock = app.requestSingleInstanceLock();
const win_w = 950, win_h = 600;
let win = null, winPo = null, ws = null;

const WinOpt = (width, height) => {
    return {
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        maxWidth: width,
        maxHeight: height,
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

    //获取当前主窗口位置
    win.on('move', (e) => {
        winPo = win.getPosition();
    });

    // 加载index.html文件
    win.loadFile(path.join(__dirname, './index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});

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
global.dialogs = [];
let is_Dialogs = [];
ipcMain.on('new-dialog', (event, args) => {
    let id = global.dialogs.length;
    for (let i of global.dialogs) {
        if (i && i.uniquekey === args.v && !i.complex) {
            i.focus();
            return;
        }
    }
    let opt = WinOpt(args.width, args.height);
    if (winPo) {
        opt.x = winPo[0] + ((win_w - args.width) / 2);
        opt.y = winPo[1] + ((win_h - args.height) / 2);
    }
    opt.parent = win;
    opt.alwaysOnTop = args.alwaysOnTop;
    global.dialogs[id] = new BrowserWindow(opt);
    global.dialogs[id].uniquekey = args.v;
    global.dialogs[id].complex = args.complex || false;
    // 打开开发者工具
    if (opt.webPreferences.devTools) global.dialogs[id].webContents.openDevTools();
    global.dialogs[id].loadFile(path.join(__dirname, './dialog.html'));
    //注入初始化代码
    global.dialogs[id].webContents.on("did-finish-load", () => {
        args.id = id;
        global.dialogs[id].webContents.send('dataJsonPort', encodeURIComponent(JSON.stringify(args)));
        win.webContents.send('newWin-rbk', 'newWin-item-' + id);
    });
    is_Dialogs[id] = true;
});

//新窗口 反馈
ipcMain.on('newWin-feedback', (event, args) => {
    win.webContents.send('newWin-item-' + args.id, args);
});

//新窗口 关闭
ipcMain.on('newWin-closed', (event, id) => {
    is_Dialogs[id] = false;
    global.dialogs[id].close();
    delete global.dialogs[id];
    let is = true;
    for (let i = 0, len = is_Dialogs.length; i < len; i++) if (is_Dialogs[i]) is = false;
    if (is) {
        global.dialogs = [];
        is_Dialogs = [];
    }
});

//关闭
ipcMain.on('closed', () => {
    for (let i of global.dialogs) if (i) i.close();
    win.close();
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

//ws
const wsInit = async (address, protocols, options) => {
    ws = new webSocket(address, protocols, options);
    ws.onopen = (e) => {
        console.log('[ws]init');
    };
    ws.onclose = (e) => {
        console.log('[ws]close');
        ws = null;
    };
    ws.onerror = (e) => {
        console.log('[ws]error');
        ws = null;
    };
    ws.onmessage = (e) => {
        win.webContents.send('wsMessage', JSON.parse(e.data));
        for (let i of global.dialogs) if (i) i.webContents.send('wsMessage', JSON.parse(e.data));
    };
    await Promise.all([ws.onerror, ws.onopen, ws.onmessage, ws.onclose]);
};

//ws初始化
ipcMain.on('wsInit', async (event, args) => {
    if (!ws) await wsInit(args.address, args.protocols, args.options);
});

//wsSend
ipcMain.on('wsSend', async (event, args) => {
    if (ws) ws.send(args)
});