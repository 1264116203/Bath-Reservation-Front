const { default: baseUrl } = require('./src/config/base-url')

module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        // 本地服务接口地址
        // target: 'http://192.168.2.160:8080',
        target: 'http://localhost:8080',
        ws: true,
        pathRewrite: {
          '^/api': baseUrl
        }
      }
    }
  },
  publicPath: baseUrl
}
