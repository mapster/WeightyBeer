const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MODE = process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';

function isProd() {
    return MODE === 'production';
}

module.exports = {
    mode: MODE,
    entry: {
        'index': './index.js',
        'elm': './src/Main.elm'
    },
    devServer: isProd() ? undefined : {
        contentBase: path.join(__dirname, 'dist'),
        port: 8000,
        proxy: {
            '/api': 'http://localhost:3000',
            '/graphql': {
                target: 'ws://localhost:3000',
                ws: true
            }
        },
        historyApiFallback: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: [/\.elm$/],
                exclude: [/elm-stuff/, /node_modules/],
                use: [
                    isProd() ? null : { loader: 'elm-hot-webpack-loader' },
                    {
                        loader: 'elm-webpack-loader',
                        options: isProd() ? { optimize: true } : { debug: true, cwd: __dirname },
                    }
                ].filter(loader => loader !== null),
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: 'index.html' }),
    ]
};
