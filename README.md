# electron-template

一个基于 `electron` 多窗口模式的模板

❗ 注意 `nodejs => 14.17.0` pnpm需关闭链接 `pnpm i --shamefully-hoist`
交流 qq 群 12354891

## 主流框架模板

[vue @mlmdflr](https://github.com/mlmdflr/xps-electron-vue-template)

## electron builder 打包配置

位于 `build/cfg/build.js` 根据自己需求更改即可  
请参考 [electron-builder](https://www.electron.build/) 文档

## 模块大致文件结构参考

```
├── resources 资源
│   ├── build 打包所需的文件
│   │   ├── cfg 打包配置
│   │   └── icons 图片
│   ├── platform 对应系统依赖 (自行创建)
│   │   ├── win32
│   │   ├── darwin
│   │   └── linux
│   ├── extern 外部资源(打包后位于resources下)
│   ├── inside 内部资源(如果开启asar打包 会位于asar下)
│   └── root 和执行文件同级
├── scripts 打包的方法 、本地调试等
└── src
    ├── cfg 本地配置和 请求配置之类
    ├── utils 一些依赖方法(主、渲染可通用)
    ├── main 主进程模块
    └── renderer 渲染进程模块
```

### electron相关镜像源

```shell
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
ELECTRON_CUSTOM_DIR={{ version }}
ELECTRON_MIRROR=https://cdn.npmmirror.com/binaries/electron/v
```

## 打包发布

运行命令

```shell
[pnpm|yarn|npm] build win|win32|win64|winp|winp32|winp64|darwin|mac|linux
```
