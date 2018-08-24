const path = require('path');
const IS_DEV = true;

module.exports = {
  entry: './src/secret-hitler.ts',
  devtool: IS_DEV ? 'inline-source-map' : 'source-map',
  module: {
    rules: [
      {
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'secret-hitler.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: IS_DEV ? 'development' : 'production'
};