import {ipcRenderer} from "electron";
import {setMessageData} from "../store";
import {IpcMsg} from "@/lib/interface";

/**
 * 渲染进程初始化 (i)
 * */
export async function windowLoad() {
    return new Promise(resolve => ipcRenderer.once("window-load", async (event, args) => resolve(args)))
}

/**
 * 消息反馈
 */
export function messageBack() {
    ipcRenderer.on("message-back", (event, args) => setMessageData(args.key, args.value));
}

/**
 * 消息发送
 */
export function messageSend(args: IpcMsg) {
    ipcRenderer.send("message-send", args);
}

/**
 * 发送ipc消息
 * @param key
 * @param value
 */
export function ipcSend(key: string, value?: unknown) {
    ipcRenderer.send(key, value);
}