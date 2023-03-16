import { SerialPort } from 'serialport';
import { ipcMain } from 'electron';
import { windowInstance } from '@youliso/electronic/main/window';
import Byt, { BytPort, BytTcp } from './byt';
import Str, { StrPort, StrTcp } from './str';

export interface SerialDataBack<T> {
  key: string;
  value: T;
  type: string;
}

export interface SerialOpenOpt<T> {
  type: 'Byt' | 'Str';
  mode: 'port' | 'tcp';
  model: number;
  key: string;
  delimiter?: number | string;
  argument: T;
}

export class Serial {
  public serialsEquipment: { [key: string]: Byt | Str } = {};

  constructor() {}

  close(key: string) {
    if (!this.serialsEquipment[key]) return;
    this.serialsEquipment[key].close();
    delete this.serialsEquipment[key];
  }

  async openOnBack(
    args: SerialOpenOpt<BytPort | BytTcp | StrPort | StrTcp>,
    callback: Function
  ): Promise<number> {
    if (Object.keys(this.serialsEquipment).indexOf(args.key) > -1) return -1;
    this.serialsEquipment[args.key] =
      args.type === 'Byt'
        ? new Byt(args.mode, args.key, args.argument as BytPort, args.delimiter as number)
        : new Str(args.mode, args.key, args.argument as StrPort, args.delimiter as string);
    if (!this.serialsEquipment[args.key]) return -1;
    const is =
      args.mode === 'port'
        ? await this.serialsEquipment[args.key].openPort()
        : await this.serialsEquipment[args.key].openTcp();
    if (is === -1) {
      this.close(args.key);
      return is;
    }
    switch (args.mode) {
      case 'port':
        this.serialsEquipment[args.key].onPortData(callback);
        break;
      case 'tcp':
        this.serialsEquipment[args.key].onTcpData(callback);
        break;
    }
    return is as number;
  }

  async open(
    args: SerialOpenOpt<BytPort | BytTcp | StrPort | StrTcp>,
    single: boolean = true,
    winId?: number
  ): Promise<number> {
    if (Object.keys(this.serialsEquipment).indexOf(args.key) > -1) return -1;
    this.serialsEquipment[args.key] =
      args.type === 'Byt'
        ? new Byt(args.mode, args.key, args.argument as BytPort, args.delimiter as number)
        : new Str(args.mode, args.key, args.argument as StrPort, args.delimiter as string);
    if (!this.serialsEquipment[args.key]) return -1;
    const is =
      args.mode === 'port'
        ? await this.serialsEquipment[args.key].openPort()
        : await this.serialsEquipment[args.key].openTcp();
    if (is === -1) {
      this.close(args.key);
      return is;
    }
    const callback = (data: any) =>
      windowInstance.send(
        single ? `serial-on-back-${args.key}` : 'serial-on-back-all',
        data,
        winId
      );
    switch (args.mode) {
      case 'port':
        this.serialsEquipment[args.key].onPortData(callback);
        break;
      case 'tcp':
        this.serialsEquipment[args.key].onTcpData(callback);
        break;
    }
    return is as number;
  }

  send(key: string, value: string | Buffer) {
    if (Object.keys(this.serialsEquipment).indexOf(key) === -1) return;
    this.serialsEquipment[key].send(value);
  }

  /**
   * 开启监听
   */
  on() {
    ipcMain.handle('serialport-list', async (event) => SerialPort.list());
    ipcMain.handle('serial-close', (event, args) => this.close(args.key));
    ipcMain.handle('serial-open', (event, args) => this.open(args.arg, args.single, args.winId));
    ipcMain.handle('serial-send', (event, args) => this.send(args.key, args.value));
  }
}
