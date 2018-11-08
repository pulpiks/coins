const path = require('path')
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
// const CleanWebpackPlugin = require("clean-webpack-plugin")

const IS_PRODUCTION = (process.env.NODE_ENV === 'production')

// const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
// const phaser = path.join(phaserModule, 'build/phaser.js')

// const pathPhaser = /node_modules\/phaser-ce\/build/

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        index: './src/index.ts',
        // phaser: './node_modules/phaser-ce/build/phaser.js',
    },
    output: {
        // publicPath: path.resolve(__dirname),
        filename: '[name].js',
        // publicPath: '/',
        // path: path.resolve(__dirname, 'dist'),
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            "node_modules",
            path.resolve(__dirname, "src"),
        ],
        alias: {
            // 'phaser-ce': phaser
        },
    },
    plugins: [
        // new CleanWebpackPlugin("dist"),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "index.html"),
            chunks: [
                // "phaser",
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
            {
                test: /\.(png|jpg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "assets/",
                        },
                    },
                ],
            },
            // {
            //     test: /node_modules\/phaser-ce\/build\/custom\/pixi.js/,
            //     use: [
            //       {
            //         loader: 'expose-loader',
            //         options: 'PIXI'
            //       }
            //     ]
            // },
            // {
            //     test: /node_modules\/phaser-ce\/build\/custom\/p2.js/,
            //     use: [
            //       {
            //         loader: 'expose-loader',
            //         options: 'p2'
            //       }
            //     ]
            // },
            // {
            //     // test: /node_modules\/phaser-ce\/build\/custom\/phaser-split.js/,
            //     test: require.resolve('phaser-ce'),
            //     use: [
            //       {
            //         loader: 'expose-loader',
            //         options: 'Phaser'
            //       }
            //     ]
            // }
        ],
    },
    optimization: {
        runtimeChunk: {
            name: "runtime",
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    // test: (module, chunks) => {
                        //     return module.context.includes('node_modules') && !module.context.includes('phaser-ce')
                        // },
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
        // publicPath: '/',
    },
    devtool: "hidden-source-map",
};