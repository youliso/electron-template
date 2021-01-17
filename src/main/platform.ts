import {systemPreferences} from "electron";

export function win32() {
    global.sharedObject["appInfo"]["accentColor"] = systemPreferences.getAccentColor();
}

export const Platform: { [key: string]: Function } = {
    win32
}