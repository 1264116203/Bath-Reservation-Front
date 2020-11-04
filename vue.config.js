const { baseUrl } = require('./src/config/base-url')

module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            black: '#000',
            'text-color': 'fade(@black, 65%)',
            'primary-color': '#409EFF',
            'body-background': '#fff',
            'layout-header-background': '#20222a',
            'layout-body-background': '#f0f2f5'
          },
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
          '^/api': baseUrl
        }
      }
    }
  },
  publicPath: baseUrl
}
