const port = 8100 // dev port
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
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
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: {
      Vue: 'vue',
      vue: 'Vue'
    }
  },
  chainWebpack: config => {
    config.entry('main').add('./src/index.js')
    // set svg-sprite-loader，支持svg
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icon'))
      .end()
    config.module
      .rule('icon')
      .test(/\.svg$/)
      .include.add(resolve('src/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
