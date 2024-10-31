const { rspack } = require('@rspack/core');
const { resolve } = require('node:path');
const { builtinModules } = require('node:module');
const packageCfg = require('../package.json');
const ENV = require('./.env.json');

const outputPath = resolve('dist');
const tsConfig = resolve('tsconfig.json');

let alias = {
  '@': resolve('src')
};

let plugins = [
  new rspack.DefinePlugin({
    ...ENV
  })
];
let extensions = ['.mjs', '.ts', '.js', '.json', '.node'];
let externals = { electron: 'electron' };
builtinModules.forEach((e) => (externals[e] = e));
packageCfg.dependencies && Object.keys(packageCfg.dependencies).forEach((e) => (externals[e] = e));

let rules = [
  {
    test: /\.ts$/,
    exclude: [/node_modules/],
    loader: 'builtin:swc-loader',
    options: {
      jsc: {
        parser: {
          syntax: 'typescript'
        }
      }
    },
    type: 'javascript/auto'
  }
];

/** @type {import('@rspack/core').Configuration} */
const mainConfig = (isDevelopment) => ({
  mode: isDevelopment ? 'development' : 'production',
  target: 'electron-main',
  entry: 'src/main/index.ts',
  output: {
    path: outputPath,
    filename: 'index.js'
  },
  resolve: {
    alias,
    extensions,
    tsConfig
  },
  optimization: {
    minimize: !isDevelopment
  },
  module: {
    rules: [
      ...rules,
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins,
  externalsType: 'commonjs',
  externals,
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : false
});

/** @type {import('@rspack/core').Configuration} */
const preloadConfig = (isDevelopment) => ({
  mode: isDevelopment ? 'development' : 'production',
  target: 'electron-preload',
  entry: 'src/preload/index.ts',
  output: {
    path: outputPath,
    filename: 'preload.js'
  },
  resolve: {
    alias,
    extensions,
    tsConfig
  },
  optimization: {
    minimize: !isDevelopment
  },
  module: {
    rules
  },
  plugins,
  externalsType: 'commonjs',
  externals,
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : false
});

/** @type {import('@rspack/core').Configuration} */
const rendererConfig = (isDevelopment) => ({
  mode: isDevelopment ? 'development' : 'production',
  target: 'web',
  entry: 'src/renderer/index.ts',
  output: {
    path: outputPath,
    chunkFilename: 'assets/[id].js'
  },
  resolve: {
    alias,
    extensions,
    tsConfig
  },
  optimization: {
    minimize: !isDevelopment
  },
  experiments: {
    css: true
  },
  module: {
    rules: [
      ...rules,
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset'
      },
      {
        test: /.css$/,
        type: 'css'
      }
    ]
  },
  plugins: [
    ...plugins,
    new rspack.HtmlRspackPlugin({
      templateContent: `
        <!DOCTYPE html>
        <html>
            <body>
               <div id="root"></div>
            </body>
        </html>`,
      minify: !isDevelopment
    })
  ],
  externalsType: 'import',
  externals,
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : false
});

module.exports = {
  mainConfig,
  preloadConfig,
  rendererConfig
};