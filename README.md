# electron-template

一个基于 `electron` 多窗口模式的模板

❗ 注意 `nodejs => 14.17.0`  
交流 qq 群 12354891

## 示例

[vue](https://github.com/youliso/electron-template-vue)

## electron builder 打包配置

位于 `build/cfg/build.js` 根据自己需求更改即可  
请参考 [electron-builder](https://www.electron.build/) 文档

## 模块大致文件结构参考

```
├── build 打包所需的文件
│   ├── cfg 打包配置
│   ├── icons 图片
│   └── script 打包的方法 、本地调试等
├── resources 依赖
│   ├── platform 对应系统依赖
│   │   ├── win32
│   │   ├── darwin
│   │   └── linux
│   ├── extern 外部依赖(打包后位于resources下)
│   ├── inside 内部依赖(如果开启asar打包 会位于asar下)
│   └── root 和执行文件同级
└── src
    ├── cfg 本地配置和 请求配置之类
    ├── utils 一些依赖方法(主、渲染可通用)
    ├── main 主进程模块
    └── renderer 渲染进程模块
```

### 安装中的网络问题

- `electron`:

```shell
yarn config set electron_mirror https://cdn.npm.taobao.org/dist/electron/
```

## 运行调试

运行命令

```shell
yarn dev
```

## 打包发布

运行命令

```shell
yarn build win|win32|win64|winp|winp32|winp64|darwin|mac|linux
```
