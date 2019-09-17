const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = (env, argv) => {
  const PROD = (argv.mode === 'production');

  let config = {
    entry: './src/js/app.js',
    output: {
      path: path.resolve(__dirname, './assets'),
      publicPath: '/assets/',
      filename: PROD ? 'js/build.min.js': 'js/build.js'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader?url=false', 'sass-loader']
          })
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env']
              ]
            }
          }]
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin(PROD ? './css/style.min.css' : './css/style.css'),
      new BrowserSyncPlugin({
        host: 'decorator.loc',
        proxy: 'decorator.loc',
        port: 8080,
        open: false,
        files: [
          __dirname
        ]
      })
    ]
  };

  if (PROD) {
    config.plugins = (config.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ]);
  }

  return config;

};
