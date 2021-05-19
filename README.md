# electron-vue3 
一个基于 `electron` & `vue3` 多窗口模式的模板

❗注意 `nodejs => 14.17.0`  `vue` \ `vue-router` 版本 

## 引入依赖问题
- `外部`不会被打包进asar包内:  
所有外部依赖放入到 `src/lib/extern`  
调用 `src/lib/index.ts`  内`getExternPath()` 方法可获取 调试和打包 对应路径   
  

- `内部` 会被打包进asar包内:  
  所有内部依赖放入到 `src/lib/inside`  
  调用 `src/lib/index.ts`  内`getInsidePath()` 方法可获取 调试和打包 对应路径

## electron builder 打包配置
位于 `build/cfg/build.js` 根据自己需求更改即可   
请参考 [electron-builder](https://www.electron.build/) 文档

## 模块大致文件结构参考
```
├── build 打包所需的文件
│   ├── cfg 打包配置
│   ├── icons 图片
│   └── script 打包的方法 、本地调试等
└── src
    ├── cfg 本地配置和 请求配置之类
    ├── lib 一些依赖方法(主、渲染可通用)
    │   ├── extern 外部依赖(打包后位于resources下)
    │   └── inside 内部依赖(如果开启asar打包 会位于asar下)
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
yarn run dev
```
