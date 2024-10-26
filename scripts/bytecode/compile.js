const electronPath = require('electron');
const { spawn } = require('child_process');

module.exports = (code, DecodeNumber) => {
  return new Promise((resolve, reject) => {
    let data = Buffer.from([]);
    let proc = spawn(electronPath, ['scripts/bytecode/electronProcess.js'], {
      env: { ELECTRON_RUN_AS_NODE: '1', DecodeNumber },
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });
    if (proc.stdin) {
      proc.stdin.write(code); //向子进程传递数据
      proc.stdin.end();
    }
    if (proc.stdout) {
      proc.stdout.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
      });
      proc.stdout.on('error', (err) => {
        console.error(err);
      });
      proc.stdout.on('end', () => {
        resolve(data); //得到字节码数据
      });
    }
    if (proc.stderr) {
      proc.stderr.on('data', (chunk) => {
        console.error('Error: ', chunk.toString());
      });
      proc.stderr.on('error', (err) => {
        console.error('Error: ', err);
      });
    }
    proc.addListener('message', (message) => console.log(message));
    proc.addListener('error', (err) => console.error(err));
    proc.on('error', (err) => {
      //error
    });
    proc.on('exit', () => {
      resolve(data); //得到字节码数据
    });
  });
};
