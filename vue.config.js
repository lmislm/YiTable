const port = 8100 // dev port

module.exports = {
  productionSourceMap: false,
  css: {
    extract: false,
},
  devServer: {
    port: port,
    open: true,
    hot: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  chainWebpack: config => {
    config.entry('main').add('./src/index.js')
  }
}
