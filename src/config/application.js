/**
 * 全局配置文件
 */
export default {
  // 网站标题
  title: '浴池预订',
  // 网站简写
  subtitle: 'R',
  // 配置主键,目前用于存储
  key: 'RCDCore',
  // 首页文字
  indexTitle: 'RCDCore Front',
  // 配置首页不可关闭
  firstPageCloseable: false,
  homepageTab: {
    key: '1',
    label: '首页',
    path: '/main/home',
    params: {},
    query: {},
    group: [],
    closeable: false
  },
  // 配置菜单的属性
  menu: {
    iconDefault: 'check-circle'
  },
  // 密码在传递是是否经过Base64转码
  pwdEncoded: false
}
