import { rspack } from '@rspack/core';
import { resolve } from 'node:path';
import { builtinModules } from 'node:module';
import packageCfg from '../package.json' assert { type: 'json' };
import ENV from './.env.json' assert { type: 'json' };

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
let externals = [...builtinModules, 'electron'];
for (const i in packageCfg.dependencies) externals.push(i);
externals = externals.map((e) => `/^(${e}|\$)$/i`);
let rules = (isDevelopment) => [
  {
    test: /\.(png|jpg|jpeg|gif|svg)$/i,
    type: 'asset'
  },
  {
    test: /\.(j|t)s$/,
    exclude: [/[\\/]node_modules[\\/]/],
    loader: 'builtin:swc-loader',
    options: {
      jsc: {
        parser: {
          syntax: 'typescript'
        },
        externalHelpers: true,
        transform: {
          react: {
            runtime: 'automatic',
            development: isDevelopment,
            refresh: isDevelopment
          }
        }
      }
    }
  }
];

export const mainConfig = (isDevelopment) => ({
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
    rules: rules(isDevelopment)
  },
  plugins,
  externals
});

export const preloadConfig = (isDevelopment) => ({
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
    rules: rules(isDevelopment)
  },
  plugins,
  externals
});

export const rendererConfig = (isDevelopment) => ({
  mode: isDevelopment ? 'development' : 'production',
  target: 'web',
  entry: 'src/renderer/index.ts',
  output: {
    path: outputPath,
    chunkFormat: 'module',
    chunkFilename: '[id].js'
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
    rules: rules(isDevelopment)
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
  externals,
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : false
});
