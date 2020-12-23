const { resolve } = require("path");
const { exec } = require("child_process");

const abi = 87; //electron abi
const target = "11.0.4"; //electron 版本
const distUrl = "https://electronjs.org/headers"; // electron 头文件地址

switch (process.env.NODE_ENV) {
    case "npm":
        exec(`npm rebuild --runtime=electron --target=${target} --disturl=${distUrl} --abi=${abi}`, { cwd: resolve(__dirname, "../../") }, (error, stdout, stderr) => {
            if (error) {
                console.log("[rebuild:err]", error);
                return;
            }
            console.log("[rebuild:stdout]", stdout);
            console.log("[rebuild:stderr]", stderr);
        });
        break;
    case "electron":
        exec("electron-rebuild", { cwd: resolve(__dirname, "../../") }, (error, stdout, stderr) => {
            if (error) {
                console.log("[rebuild:err]", error);
                return;
            }
            console.log("[rebuild:stdout]", stdout);
            console.log("[rebuild:stderr]", stderr);
        });
        break;
}