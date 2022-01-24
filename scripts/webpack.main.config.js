const { resolve } = require('path');
const { dependencies } = require('../package.json');
const base = require('./webpack.base.config');

module.exports = (env) => {
  let config = {
    ...base,
    externals: {},
    mode: env,
    target: 'electron-main',
    entry: {
      main: './src/main/index.ts',
      preload: './src/main/preload/index.ts'
    },
    output: {
      filename: './js/[name].js',
      path: resolve('dist')
    },
    optimization: {
      minimize: env === 'production'
    }
  };

  if (env === 'production') config.devtool = base.devtool;

  for (const i in dependencies) config.externals[i] = `require("${i}")`;

  return config;
};
