import { ipcMain } from 'electron';
import koffi from 'koffi';

const lib = koffi.load('user32.dll');

const MB_YESNO = 0x4;
const MB_ICONQUESTION = 0x20;
const MB_ICONINFORMATION = 0x40;
const IDYES = 6;

const MessageBoxA = lib.func('__stdcall', 'MessageBoxA', 'int', ['void *', 'str', 'str', 'uint']);
const MessageBoxW = lib.func('__stdcall', 'MessageBoxW', 'int', [
  'void *',
  'str16',
  'str16',
  'uint'
]);

export function messageBox() {
  let ret = MessageBoxA(
    null,
    'Do you want another message box?',
    'Koffi',
    MB_YESNO | MB_ICONQUESTION
  );
  if (ret == IDYES) MessageBoxW(null, 'Hello World!', 'Koffi', MB_ICONINFORMATION);
}

export function On() {
  ipcMain.on('win32-messageBox', (event) => {
    messageBox();
  });
}
