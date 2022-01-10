import Serialport from 'serialport';

export default class Str {
  private data: string = '';
  public path: string = '';
  public opt: Serialport.OpenOptions = {};
  public delimiter: string | undefined;
  public serial: Serialport | undefined;

  constructor(path: string, delimiter: string, opt: Serialport.OpenOptions) {
    this.path = path;
    this.opt = opt || {
      baudRate: 115200
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
      data = Buffer.from(data, 'hex').toString('utf-8');
      console.log('[parser]', data);
      this.data += data;
      if (this.delimiter) {
        let indexOf = this.data.indexOf(this.delimiter);
        if (indexOf > -1) {
          let value = this.data.slice(0, indexOf + this.delimiter.length);
          this.data = this.data.replace(value, '');
          callback({ key: this.path, value, type: 'Strings' });
        }
      } else callback({ key: this.path, value: data, type: 'Strings' });
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
