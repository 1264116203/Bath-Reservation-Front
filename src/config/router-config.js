// 加载路由组件主体
import '@/router'

// 加载路由拦截器
import '@/router/interceptors/auth-interceptor'
import '@/router/interceptors/tab-switching-interceptor'
import '@/router/interceptors/keep-alive-destroyer'
import '@/router/interceptors/bad-chunk-catcher'
