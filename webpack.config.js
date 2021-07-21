const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const production = (process.env.WEBPACK_ENV || process.env.NODE_ENV) === 'production'

module.exports = {
  mode: production ? 'production' : 'development',
  entry: path.join(__dirname, 'static', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.less', '.html']
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'handlebars-loader',
        include: path.resolve(__dirname, 'src'),
        options: {
          helperDirs: path.join(__dirname, 'src/utils/handlebarsHelpers'),
          precompileOptions: {
            knownHelpersOnly: false,
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'static/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'static/assets', to: 'assets' },
      ],
    }),
  ],
  devServer: {
    historyApiFallback: {
      index: '/dist/index.html'
    },
    compress: true,
    port: 3000,
  },
};
