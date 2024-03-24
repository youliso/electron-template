import { windowInstance } from '@youliso/electronic/main';
import { ipcMain } from 'electron';
import koffi from 'koffi';

const user32 = koffi.load('user32.dll');
const dwmapi = koffi.load('dwmapi.dll');

const MB_YESNO = 0x4;
const MB_ICONQUESTION = 0x20;
const DWMWA_EXCLUDED_FROM_PEEK = 12;

const MessageBoxA = user32.func('__stdcall', 'MessageBoxA', 'int', [
  'void *',
  'str',
  'str',
  'uint'
]);

const DwmSetWindowAttribute = dwmapi.func('__stdcall', 'DwmSetWindowAttribute', 'ulong', [
  'long',
  'ulong',
  'bool*',
  'ulong'
]);

export function messageBox() {
  return MessageBoxA(null, 'Do you want another message box?', 'Koffi', MB_YESNO | MB_ICONQUESTION);
}

export function dwmSetWindowAttribute(hwnd: number) {
  try {
    return DwmSetWindowAttribute(hwnd, DWMWA_EXCLUDED_FROM_PEEK, [true], 32);
  } catch (error) {
    console.error(error);
  }
}

export function On() {
  ipcMain.handle('win32-messageBox', () => {
    return messageBox();
  });
  ipcMain.handle('win32-dwmSetWindowAttribute', (_, id?: number) => {
    const hwnd = windowInstance.getHWnd(id);
    return dwmSetWindowAttribute(hwnd!);
  });
}
