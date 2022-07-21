import { Socket } from 'net';
import { SerialPort } from 'serialport';

export interface StrPort {
  path: string;
  baudRate: number;
}

export interface StrTcp {
  ip: string;
  port: number;
}

export default class Str {
  private data: string = '';
  public key: string = '';
  public ip: string = '';
  public port: number = 0;
  public path: string = '';
  public baudRate: number = 0;
  public delimiter: string | undefined;
  public serial: SerialPort | undefined;
  public client: Socket | undefined;

  constructor(type: 'port' | 'tcp', key: string, args: StrPort | StrTcp, delimiter?: string) {
    this.key = key;
    if (delimiter) this.delimiter = delimiter;
    switch (type) {
      case 'port':
        const { path, baudRate } = args as StrPort;
        this.path = path;
        this.baudRate = baudRate || 115200;
        break;
      case 'tcp':
        const { ip, port } = args as StrTcp;
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
        data = Buffer.from(data, 'hex').toString('utf-8');
        this.data += data;
        if (this.delimiter) {
          let indexOf = this.data.indexOf(this.delimiter);
          if (indexOf > -1) {
            let value = this.data.slice(0, indexOf + this.delimiter.length);
            this.data = this.data.replace(value, '');
            callback({ key: this.key, value, type: 'Str' });
          }
        } else callback({ key: this.key, value: data, type: 'Str' });
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
      this.client.connect(this.port, this.ip, () => {
        console.log(`${this.key} open`);
        resolve(0);
      });
    });
  }

  onTcpData(callback: Function) {
    if (this.client)
      this.client.on('data', (data) => {
        const str = data.toString('utf-8');
        this.data += str;
        if (this.delimiter) {
          let indexOf = this.data.indexOf(this.delimiter);
          if (indexOf > -1) {
            let value = this.data.slice(0, indexOf + this.delimiter.length);
            this.data = this.data.replace(value, '');
            callback({ key: this.key, value, type: 'Str' });
          }
        } else callback({ key: this.key, value: data, type: 'Str' });
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
