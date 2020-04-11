const path = require('path')

const port = 8100 // dev port

module.exports = {
  publicPath: '/dist/',
  css: {
    extract: false
  },
  outputDir: path.resolve(__dirname, './dist'),
  devServer: {
    port: port,
    open: true,
    hot: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  pages: {
    index: {
      entry: 'lib/yi-table.umd.min.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  chainWebpack: config => {
    config.entry('main').add('./src/index.js')
  }
}
