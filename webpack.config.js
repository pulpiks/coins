const path = require('path');

const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: './index.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            { test: /\.([tj])s$/, use: { loader: 'ts-loader' } },
        ],
    }
};