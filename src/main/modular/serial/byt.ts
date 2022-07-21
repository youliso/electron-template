import { Socket } from 'net';
import { SerialPort } from 'serialport';

export interface BytPort {
  path: string;
  baudRate: number;
}

export interface BytTcp {
  ip: string;
  port: string;
}
export default class Byt {
  private data: number[] = [];
  public key: string = '';
  public ip: string = '';
  public port: string = '';
  public path: string = '';
  public baudRate: number = 0;
  public delimiter: number | undefined;
  public serial: SerialPort | undefined;
  public client: Socket | undefined;

  constructor(type: 'port' | 'tcp', key: string, args: BytPort | BytTcp, delimiter?: number) {
    this.key = key;
    if (delimiter) this.delimiter = delimiter;
    switch (type) {
      case 'port':
        const { path, baudRate } = args as BytPort;
        this.path = path;
        this.baudRate = baudRate || 115200;
        break;
      case 'tcp':
        const { ip, port } = args as BytTcp;
        this.ip = ip;
        this.port = port;
        break;
    }
  }

  /**
   * 开启
   */
  openPort() {
    return new Promise((resolve) => {
      this.serial = new SerialPort({
        path: this.path,
        baudRate: this.baudRate
      });
      this.serial.on('error', (err) => {
        console.error('[SerialPortError]', err);
        delete this.serial;
        resolve(-1);
      });
      this.serial.on('open', () => {
        console.log(`${this.key} open`);
        resolve(0);
      });
    });
  }
  /**
   * 数据监听
   */
  onPortData(callback: Function) {
    if (this.serial)
      this.serial.on('data', (data) => {
        if (this.delimiter) {
          this.data.push(...data);
          let indexOf = this.data.indexOf(this.delimiter);
          if (indexOf > -1) {
            let value = this.data.splice(0, indexOf + 1);
            callback({ key: this.key, value, type: 'Byt' });
          }
        } else callback({ key: this.key, value: data, type: 'Byt' });
      });
  }

  openTcp() {
    return new Promise((resolve) => {
      this.client = new Socket();
      this.client.on('error', (err) => {
        console.error(err);
        delete this.client;
        resolve(-1);
      });
      this.client.connect(Number(this.port), this.ip, () => {
        console.log(`${this.key} open`);
        resolve(0);
      });
    });
  }

  onTcpData(callback: Function) {
    if (this.client)
      this.client.on('data', (data) => {
        if (this.delimiter) {
          this.data.push(...data);
          let indexOf = this.data.indexOf(this.delimiter);
          if (indexOf > -1) {
            let value = this.data.splice(0, indexOf + 1);
            callback({ key: this.key, value, type: 'Byt' });
          }
        } else callback({ key: this.key, value: data, type: 'Byt' });
      });
  }

  /**
   * 发送
   */
  send(data: string | Buffer) {
    if (this.serial) this.serial.write(data);
    else if (this.client) this.client.write(data);
  }

  /**
   * 关闭
   */
  close() {
    if (this.serial) this.serial.close();
    else if (this.client) this.client.end();
  }
}
