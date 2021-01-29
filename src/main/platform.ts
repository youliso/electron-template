import {systemPreferences} from "electron";

export function win32() {
    global.sharedObject["appInfo"]["accentColor"] = systemPreferences.getAccentColor();
}

export function linux() {
}

export function darwin() {

}

export const Platform: { [key: string]: Function } = {
    win32,
    linux,
    darwin
}
