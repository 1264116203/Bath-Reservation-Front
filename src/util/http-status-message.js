export function getMessageFromHttpStatusCode(statusCode) {
  let message = '请求异常，但服务器未给出错误信息。'
  switch (statusCode) {
    case null:
      message = '请求失败，请检查网络连接'
      break
    case 400:
      message = '请求参数有误。'
      break
    case 401:
      message = '令牌已失效，请重新登录。'
      break
    case 403:
      message = '请求被拒绝，请检查用户权限。'
      break
    case 404:
      message = '要访问的记录不存在或服务器变更了请求路径。'
      break
    case 405:
      message = '请求方法不正确。'
      break
    case 500:
      message = '服务器内部错误。'
      break
    case 503:
      message = '该服务暂时不可用。'
      break
    default:
  }
  return message
}
