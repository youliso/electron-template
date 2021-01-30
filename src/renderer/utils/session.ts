import {ipcRenderer} from "electron";

/**
 * 指定headers
 */
export function sessionSetHeaders(args: { [key: string]: { [key: string]: string } }) {
    ipcRenderer.send("session-set-headers", args);
}
