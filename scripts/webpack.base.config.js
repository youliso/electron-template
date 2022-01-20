const { resolve } = require('path');

module.exports = {
  devtool: 'eval-cheap-source-map',
  experiments: {
    topLevelAwait: true
  },
  node: {
    global: false,
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      dist: resolve('dist'),
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx|jsx|ts|js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                dynamicImport: true,
                tsx: true
              },
              transform: {
                react: {
                  pragma: 'h',
                  pragmaFrag: 'f',
                  throwIfNamespace: true,
                  development: false,
                  useBuiltins: false
                }
              },
              target: 'es2022'
            }
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif|ico|woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]'
        }
      }
    ]
  }
};
