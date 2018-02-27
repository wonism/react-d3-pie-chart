const webpack = require('webpack');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const dir = isProduction ? 'src' : 'demo';
const plugins = isProduction ? [
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify('production')
    }
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
] : [
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify('development')
    }
  }),
];
const output = isProduction ? {
  path: path.join(__dirname, 'dist'),
  filename: 'react-d3-pie-chart.js',
  libraryTarget: 'umd',
  library: 'ReactD3PieChart',
} : {
  path: path.resolve(__dirname, dir),
  filename: 'bundle.js',
  publicPath: '/',
};
const externals = isProduction ? {
  react: 'react',
  'react-dom': 'ReactDOM',
} : {};

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: path.resolve(__dirname, `${dir}/index.js`),
  devServer: {
    contentBase: path.resolve(__dirname, dir),
    hot: true,
    inline: true,
    port: 8888,
    historyApiFallback: true,
    compress: false,
  },
  output,
  plugins,
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      include: path.resolve(__dirname, dir),
      exclude: /(node_modules|bower_components)/,
      options: {
        failOnWarning: true,
        failOnError: true,
        emitWarning: true,
      },
    }, {
      use: 'babel-loader',
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      path.resolve(__dirname, dir),
    ],
  },
  externals,
};
