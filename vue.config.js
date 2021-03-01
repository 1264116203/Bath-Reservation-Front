const ImportRetry = require('webpack-plugin-import-retry')
const { modifyVars } = require('./build/less-modify-vars')

const config = {
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
        // 本地服务接口地址，如要修改，请在项目根目录建立一个名为".env.development.local"的文件，并设置
        // VUE_APP_DEV_SERVER_HOST=要连接的远端服务，不要直接修改本配置项
        // 因为.env.development.local文件不会添加到Git管理，所以不会影响别人
        target: process.env.VUE_APP_DEV_SERVER_HOST,
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  publicPath: process.env.VUE_APP_BASE_PATH,
  configureWebpack: {
    plugins: [
      new ImportRetry()
    ]
  }
}

// 只在打包时开启编译优化
if (process.env.NODE_ENV === 'production') {
  config.transpileDependencies = ['ant-design-vue', 'v-contextmenu', 'vue-runtime-helpers']
}

module.exports = config
