const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: './js/app.js',
  output: {
    filename: '../../js/scripts.js'
  },
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
          use: {
            loader: 'babel-loader',
            options: {
                presets: ['env']
            }
          }
        },
        {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?url=false', 'sass-loader']
        })
        }
    ]
  },
  plugins: [
    new ExtractTextPlugin('../../css/style.css'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      '$': 'jquery',
      jquery: 'jquery',
      'jquery': 'jquery',
      jQuery: 'jquery',
      'jQuery': 'jquery',
      'window.jquery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    }),
    new BrowserSyncPlugin({
      host: 'frant.loc',
      port: 3000,
      proxy: 'frant.loc',
      open: false,
      files: ["./*.*"],
    })
    // new BrowserSyncPlugin({
    //   host: 'localhost',
    //   port: 777,
    //   server: {
    //     baseDir: ['../prod'],
    //     files: ["../prod/*.*", "../prod/index.html"],
    //     index: "index.html",
    //     serveStaticOptions: {
    //         extensions: ["html"]
    //     }
    //   }
    // })
  ]
};