const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./libs/parts');
const path = require('path');
const stylelint = require('stylelint');
const validate = require('webpack-validator');
const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(process.cwd(), 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css'),
  ],
  images: path.join(__dirname, 'app', 'images'),
  build: path.join(__dirname, 'build'),
};
const ENV = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8080
}

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    hot: 'react-hot-loader/patch',
    app: PATHS.app,
    style: PATHS.style,
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel?cacheDirectory'], include: PATHS.app, },
      { test: /\.(jpg|png)$/, loader: 'file?name=[path][name].[hash].[ext]', include: PATHS.images },
    ],
    preLoaders: [
      { test: /\.json$/, loader: 'json', exclude: [/node_modules/, /build/] },
      { test: /\.jsx?$/, loaders: ['eslint'], include: PATHS.app, },
      { test: /\.css$/,  loaders: ['postcss'], include: PATHS.app, },
    ],
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: require('html-webpack-template'),
      title: 'WeightyBeer',
      appMountId: 'app',
      inject: false,
    }),
  ],
  postcss: () => [
    stylelint({
      rules: {
        'color-hex-case': 'lower'
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};

let config;

switch (TARGET) {
  case 'build':
  case 'stats':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js',
        },
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: Object.keys(pkg.dependencies),
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app])
    );
    break;

  default:
    config = merge(
      common,
      parts.devServer({
        host: ENV.HOST,
        port: ENV.PORT,
      }),
      {
        devtool: 'source-map',
      },
      parts.setupCSS(PATHS.style)
    );
}

module.exports = validate(config, {
  quiet: true,
});
