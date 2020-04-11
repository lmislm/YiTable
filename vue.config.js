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
    overlay: {
      warnings: false,
      errors: true
    }
  },
  chainWebpack: config => {
    config.entry('main').add('./src/index.js')
  }
}
