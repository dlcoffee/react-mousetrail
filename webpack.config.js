const path = require('path')

module.exports = {
  entry: './lib/index.js',

  mode: 'production',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },

  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
    },
  },

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },
}
