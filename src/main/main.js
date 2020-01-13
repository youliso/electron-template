'use strict';
const {
    shell,
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain
} = require('electron');
const path = require('path');
const gotTheLock = app.requestSingleInstanceLock();

let win;

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
            devTools: true,
            nodeIntegration: true,
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

const createWindow = async () => {
    // 创建浏览器窗口。
    win = new BrowserWindow(WinOpt(950, 600));

    //注入初始化代码
    win.webContents.on("did-finish-load", () => {
        let js = `require('./lib/util').init(Vue,'app').then(lib => new Vue(lib));`;
        win.webContents.executeJavaScript(js);
    });

    //默认浏览器打开跳转连接
    win.webContents.on('new-window', (event, url, frameName, disposition, options) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    // 打开开发者工具
    win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        win = null
    });

    // 加载index.html文件
    await win.loadFile(path.join(__dirname, './index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', async () => {
    if (win === null) {
        await createWindow()
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

//关闭
ipcMain.on('closed', () => {
    win.close()
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

//新窗口
const newWins = [];
ipcMain.on('newWin', async (event, args) => {
    let index = newWins.length;
    newWins[index] = new BrowserWindow(WinOpt(args.width, args.height));
    // 打开开发者工具
    newWins[index].webContents.openDevTools();
    //注入初始化代码
    newWins[index].webContents.on("did-finish-load", async () => {
        let js = `require('./lib/util').init(Vue,'dialog',{name:'${args.name}',v:'${args.v}',id:${index}}).then(lib => new Vue(lib));`;
        await newWins[index].webContents.executeJavaScript(js);
    });
    newWins[index].loadFile(path.join(__dirname, './dialog.html'));
    newWins[index].show();
    newWins[index].focus();
});

//新窗口 关闭
ipcMain.on('newWin-closed', (event, args) => {
    newWins[args.id].close();
});

//协议调起
const args = [];
if (!app.isPackaged) {
    args.push(path.resolve(process.argv[1]));
}
args.push('--');
const PROTOCOL = app.name;
app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args);
