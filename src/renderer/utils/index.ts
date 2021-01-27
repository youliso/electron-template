import {ipcRenderer} from "electron";
import {IpcMsg} from "@/lib/interface";
import {setMessageData} from "@/renderer/store";

/**
 * 消息反馈 (i)
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
