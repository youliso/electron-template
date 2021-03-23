const { resolve } = require('path');
const { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader');
module.exports = (env) => {
    return {
        mode: env,
        target: 'electron-main',
        entry: {
            main: './src/main/index.ts'
        },
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[id].bundle.js',
            path: resolve('dist')
        },
        node: {
            global: false,
            __dirname: false,
            __filename: false
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'ts',
                        target: 'esnext'
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|svg|jpg|gif|ico)$/,
                    use: [
                        'file-loader'
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                'dist': resolve('dist'),
                '@': resolve('src')
            }
        },
        optimization: {
            minimize: env === 'production',
            minimizer: [
                new ESBuildMinifyPlugin({
                    target: 'esnext'
                })
            ]
        },
        plugins: [
        ]
    };
};