const KEYSJSON = require('../../../src/cfg/keys.json');

// 特定字符Unicode编码（密钥等等之类）
module.exports = (code) => {
  let external_keys = {};
  Object.keys(KEYSJSON).forEach((key) => {
    external_keys[`"${KEYSJSON[key]}"`] = `String.fromCharCode(${Array.from(KEYSJSON[key])
      .map((s) => s.charCodeAt(0))
      .toString()})`;
  });
  Object.keys(external_keys).forEach((key) => {
    code = code.replace(key, external_keys[key]);
  });
  return code;
};
