# electron-vue3
electron & vue3   
一个多窗口模式的脚手架

❗注意  `vue` or `vue-router` 版本

## 引入外部依赖问题
所有外部依赖放入到 `src/lib/extern`  
调用 `src/lib/index.ts`  内`getExternPath()` 方法可获取 调试和打包 对应路径

## 安装依赖
运行命令
```shell
npm install or yarn
```
### 安装中的网络问题
- `electron`:
```shell
npm/yarn config set electron_mirror https://npm.taobao.org/mirrors/electron/
```

## 运行调试
运行命令
```shell
npm/yarn run dev:all
```

## electron builder 配置
位于 resources/script/build.js  
打包命令
```shell
npm/yarn run build
```
