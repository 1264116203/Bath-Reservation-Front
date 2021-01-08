const { modifyVars } = require('./build/less-modify-vars')

module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars,
          javascriptEnabled: true
        }
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
          '^/api': '/'
        }
      }
    }
  },
  publicPath: process.env.VUE_APP_BASE_PATH
}
