import Serialport from 'serialport';

export default class Byt {
  private data: number[] = [];
  public path: string = '';
  public opt: Serialport.OpenOptions = {};
  public delimiter: number | undefined;
  public serial: Serialport | undefined;

  constructor(path: string, delimiter: number, opt: Serialport.OpenOptions) {
    this.path = path;
    this.opt = opt || {
      baudRate: 19200
    };
    if (delimiter) this.delimiter = delimiter;
  }

  /**
   * 开启
   */
  async open(callback: Function) {
    this.serial = new Serialport(this.path, this.opt);
    this.serial.on('error', (err) => {
      console.error('[SerialPortError]', err);
      callback('SerialPortError');
    });
    this.serial.on('open', () => {
      console.log(`${this.path} open`);
    });
    this.serial.on('data', (data) => {
      console.log('[parser]', data);
      if (this.delimiter) {
        this.data.push(...data);
        let indexOf = this.data.indexOf(this.delimiter);
        if (indexOf > -1) {
          let value = this.data.splice(0, indexOf + 1);
          callback({ key: this.path, value, type: 'Bytes' });
        }
      } else callback({ key: this.path, value: data, type: 'Bytes' });
    });
  }

  /**
   * 发送
   */
  send(data: string | number[] | Buffer) {
    if (this.serial) this.serial.write(data);
  }

  /**
   * 关闭
   */
  close() {
    if (this.serial) this.serial.close();
  }
}
