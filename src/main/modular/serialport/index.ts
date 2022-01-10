import SerialPort from 'serialport';
import { ipcMain } from 'electron';
import Window from '../window';
import Byt from './byt';
import Str from './str';

export default class Serialport {
  public serialsEquipment: { [key: string]: Byt | Str } = {};

  constructor() {
    console.log('start Serial');
  }

  /**
   * 开启监听
   */
  on() {
    //获取串口列表
    ipcMain.handle('serialport-list', async (event) => SerialPort.list());

    //关闭串口
    ipcMain.on('serialport-close', (event, args) => {
      if (this.serialsEquipment[args.key]) {
        this.serialsEquipment[args.key].close();
        delete this.serialsEquipment[args.key];
      }
    });

    //开启串口
    ipcMain.on('serialport-open', async (event, args) => {
      if (Object.keys(this.serialsEquipment).indexOf(args.key) > -1) return;
      switch (args.type) {
        case 'Byt':
          this.serialsEquipment[args.key] = new Byt(args.key, args.delimiter, args.opt);
          if (this.serialsEquipment[args.key]) {
            await this.serialsEquipment[args.key].open((req: any) => {
              if (req) {
                if (req === 'SerialPortError') {
                  delete this.serialsEquipment[args.key];
                  Window.send('serial-back', { key: args.key, value: '[&ERROR]', type: 'Byt' });
                  return;
                }
                Window.send('serial-back', req);
              }
            });
          } else {
            Window.send('serial-back', { key: args.key, value: '[&ERROR]', type: 'Byt' });
          }
          break;
        case 'Str':
          this.serialsEquipment[args.key] = new Str(args.key, args.delimiter, args.opt);
          if (this.serialsEquipment[args.key]) {
            await this.serialsEquipment[args.key].open((req: any) => {
              if (req) {
                if (req === 'SerialPortError') {
                  delete this.serialsEquipment[args.key];
                  Window.send('serial-back', { key: args.key, value: '[&ERROR]', type: 'Str' });
                  return;
                }
                Window.send('serial-back', req);
              }
            });
          } else {
            Window.send('serial-back', { key: args.key, value: '[&ERROR]', type: 'Str' });
          }
          break;
      }
    });

    //发送消息
    ipcMain.on('serialport-send', async (event, args) => {
      if (Object.keys(this.serialsEquipment).indexOf(args.key) === -1) return;
      this.serialsEquipment[args.key].send(args.value);
    });
  }
}
