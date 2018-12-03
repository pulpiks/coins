const path = require('path')
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const Dotenv = require("dotenv-webpack")
// const CleanWebpackPlugin = require("clean-webpack-plugin")

const IS_PRODUCTION = (process.env.NODE_ENV === 'production' || process.env.WEBPACK_MODE === 'production')

// const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
// const phaser = path.join(phaserModule, 'build/phaser.js')

// const pathPhaser = /node_modules\/phaser-ce\/build/

console.log(IS_PRODUCTION)

console.log(path.resolve(__dirname))

const plugins = [
    // new CleanWebpackPlugin("dist"),
    IS_PRODUCTION ? false: new Dotenv(),
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
].filter(Boolean)


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
        publicPath: './',
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
    plugins: plugins,
    module: {
        rules: [
            {
                type: 'javascript/auto',
                test: /\.(json)/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'file-loader',
                    options: { 
                        name: '[name].[ext]', 
                        outputPath: "assets/",
                    },
                }],
            },
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
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                query: {
                    cacheDirectory: true,
                    "plugins": [
                        ["@babel/plugin-proposal-function-bind"],
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ["@babel/plugin-proposal-class-properties", { "loose" : true }]
                    ],
                    presets: ['@babel/preset-env']
                }
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
        // IS_PRODUCTION ?  ...{ 
        //     minimizer: [
        //         // we specify a custom UglifyJsPlugin here to get source maps in production
        //         new UglifyJsPlugin({
        //             cache: true,
        //             parallel: true,
        //             uglifyOptions: {
        //                 compress: false,
        //                 ecma: 6,
        //                 mangle: true
        //             },
        //             sourceMap: true,
        //             output: {
        //                 comments: false,
        //                 beautify: false
        //             }
        //         })
        //     ]
        // } : ...{}
    },
    mode: IS_PRODUCTION ? "production" : "development",
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