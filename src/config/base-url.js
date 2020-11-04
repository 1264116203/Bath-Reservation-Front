let baseUrl = '/'

const env = process.env
// 开发环境下需要配置base路径，默认使用./
// 不适用于多页面应用及history模式的SPA路由
if (env.NODE_ENV === 'production') {
  baseUrl = './'
}

module.exports = {
  baseUrl
}
