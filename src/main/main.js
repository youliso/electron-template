'use strict';
const {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain
} = require('electron');
const path = require('path');
const gotTheLock = app.requestSingleInstanceLock();

let win;

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
    win = new BrowserWindow({
        width: 800,
        height: 480,
        minWidth: 800,
        minHeight: 480,
        maxWidth: 800,
        maxHeight: 480,
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
    });

    // 加载index.html文件
    win.loadFile(path.join(__dirname, '/pages/home/index.html'));

    // 打开开发者工具
    win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        win = null
    });
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

//链接调起
const args = [];
if (!app.isPackaged) {
    args.push(path.resolve(process.argv[1]));
}
args.push('--');
const PROTOCOL = 'KlLOGIN';
app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args);