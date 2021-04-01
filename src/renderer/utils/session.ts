/**
 * 指定headers
 */
export function sessionSetHeaders(args: { [key: string]: { [key: string]: string } }) {
    window.ipcFun.send("session-set-headers", args);
}
