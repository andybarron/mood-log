const config = require('./src/node_modules/data/config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const path = require('path');
const webpack = require('webpack');

const IS_DEV = process.env.NODE_ENV !== 'production';
const SCSS_LOADERS = 'vue-style-loader!css-loader!sass-loader';
const VUE_LOADER_OPTIONS = {
  loaders: {
    scss: IS_DEV ? SCSS_LOADERS : ExtractTextPlugin.extract({
      use: ['css-loader', 'sass-loader'],
      fallback: 'vue-style-loader',
    }),
  },
};

module.exports = {
  entry: [path.resolve('src/node_modules/client/index.ts')],
  output: {
    path: path.resolve(config.OUTPUT_DIR),
    publicPath: '/',
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.APP_NAME,
      template: path.resolve('src/node_modules/client/index.html.ejs'),
      minify: {
        collapseWhitespace: true,
      },
      inlineSource: IS_DEV ? null : '\.(js|css)$',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: VUE_LOADER_OPTIONS,
      },
      {
        test: /.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]?[hash]'
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (IS_DEV) {
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.NamedModulesPlugin(),
  ]);
} else {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin('app.css'),
    new HtmlWebpackInlineSourcePlugin(),
  ]);
}
