import {join} from "path";
import {
    shell,
    app,
    BrowserWindow,
    BrowserWindowConstructorOptions, Menu, Tray
} from "electron";
import Log from "@/lib/log";
import {WindowOpt} from "@/lib/interface";
import ico from "@/assets/icon.ico";

const config = require("@/lib/cfg/config.json");

export class Window {

    public main: BrowserWindow = null; //当前主页
    public group: { [id: number]: WindowOpt } = {}; //窗口组
    public tray: Tray = null; //托盘

    constructor() {
    }

    /**
     * 窗口配置
     * */
    browserWindowOpt(wh: number[]): BrowserWindowConstructorOptions {
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
                contextIsolation: false,
                nodeIntegration: true,
                devTools: !app.isPackaged,
                webSecurity: false,
                enableRemoteModule: true
            }
        }
    }

    /**
     * 获取窗口
     * @param id
     * @constructor
     */
    getWindow(id: number) {
        return BrowserWindow.fromId(id)
    }

    /**
     * 创建窗口
     * */
    createWindow(args: WindowOpt) {
        for (let i in this.group) {
            if (this.group[i] &&
                this.group[i].route === args.route &&
                !this.group[i].isMultiWindow) {
                this.getWindow(Number(i)).focus();
                return;
            }
        }
        let opt = this.browserWindowOpt([args.width || config.appW, args.height || config.appH]);
        if (args.parentId) {
            opt.parent = this.getWindow(args.parentId);
            opt.x = parseInt((this.getWindow(args.parentId).getPosition()[0] + ((this.getWindow(args.parentId).getBounds().width - (args.width || args.currentWidth)) / 2)).toString());
            opt.y = parseInt((this.getWindow(args.parentId).getPosition()[1] + ((this.getWindow(args.parentId).getBounds().height - (args.height || args.currentHeight)) / 2)).toString());
        } else if (this.main) {
            opt.x = parseInt((this.main.getPosition()[0] + ((this.main.getBounds().width - opt.width) / 2)).toString());
            opt.y = parseInt((this.main.getPosition()[1] + ((this.main.getBounds().height - opt.height) / 2)).toString());
        }
        opt.modal = args.modal || false;
        opt.resizable = args.resizable || false;
        let win = new BrowserWindow(opt);
        this.group[win.id] = {
            route: args.route,
            isMultiWindow: args.isMultiWindow
        };
        // //window加载完毕后显示
        win.once("ready-to-show", () => win.show());
        //默认浏览器打开跳转连接
        win.webContents.on("new-window", async (event, url) => {
            event.preventDefault();
            await shell.openExternal(url);
        });
        // 打开开发者工具
        if (!app.isPackaged) win.webContents.openDevTools();
        //注入初始化代码
        win.webContents.on("did-finish-load", () => {
            if (args.isMainWin) { //是否主窗口
                if (this.main) {
                    delete this.group[this.main.id];
                    this.main.close();
                }
                this.main = win;
            }
            args.id = win.id;
            win.webContents.send("window-load", args);
        });
        if (!app.isPackaged) win.loadURL(`http://localhost:${config.appPort}`).catch(err => Log.error(err));
        else win.loadFile(join(__dirname, "./index.html")).catch(err => Log.error(err));
    }

    /**
     * 关闭所有窗口
     */
    closeAllWindow() {
        for (let i in this.group) if (this.group[i]) this.getWindow(Number(i)).close();
    }

    /**
     * 创建托盘
     * */
    async createTray() {
        const contextMenu = Menu.buildFromTemplate([{
            label: "显示",
            click: () => {
                for (let i in this.group) if (this.group[i]) this.getWindow(Number(i)).show();
            }
        }, {
            label: "退出",
            click: () => {
                app.quit();
            }
        }]);
        this.tray = new Tray(join(__dirname, `./${ico}`));
        this.tray.setContextMenu(contextMenu);
        this.tray.setToolTip(app.name);
        this.tray.on("double-click", () => {
            for (let i in this.group) if (this.group[i]) this.getWindow(Number(i)).show();
        })
    }


}
