const path = require('path')
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")

const IS_PRODUCTION = (process.env.NODE_ENV === 'production')

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/phaser.js')


module.exports = {
    context: path.resolve(__dirname),
    entry: {
        index: './src/index.ts'
    },
    output: {
        // publicPath: path.resolve(__dirname),
        filename: '[name].js',
        // publicPath: '/',
        // path: path.resolve(__dirname, 'dist'),
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            "node_modules",
            path.resolve(__dirname, "src"),
        ],
        alias: {
            'phaser-ce': phaser
        },
    },
    plugins: [
        new CleanWebpackPlugin("dist"),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "index.html"),
            chunks: [
                "vendor",
                "runtime",
                "index",
            ],
            chunksSortMode: "manual",
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            { 
                exclude: /node_modules/,
                test: /\.([tj])s$/, 
                include: [path.resolve(__dirname, "src")],
                use: [
                    { 
                        loader: 'ts-loader' 
                    }
                ] 
            },
        ],
    },
    optimization: {
        runtimeChunk: {
            name: "runtime",
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all",
                }
            }
        },
    },
    mode: "development",
    devServer: {
        index: 'index.html',
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9090,
        clientLogLevel: 'error',
        watchContentBase: true,
        publicPath: '/',
    },
    devtool: "hidden-source-map",
};