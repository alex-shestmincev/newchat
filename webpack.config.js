var path = require('path');

var node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: path.join(__dirname,'app','components') + '/App',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public', 'js')
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['jsx-loader', 'babel-loader'],
        exclude: [node_modules_dir]
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: ['', '.js', '.jsx', '.json']
  }
}