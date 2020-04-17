const path = require('path')

const port = 8100 // dev port

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '/dist/',
  productionSourceMap:false,
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
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        'vue': path.resolve('./node_modules/vue')
      }
    },
    externals: {
      vue: 'Vue'
    }
  },
  chainWebpack: config => {
    config.entry('main').add('./src/index.js')
    // set svg-sprite-loader，支持svg
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
