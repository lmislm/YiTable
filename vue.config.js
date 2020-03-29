const port = 8100 // dev port

module.exports = {
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
