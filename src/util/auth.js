import Cookies from 'js-cookie'

const TokenKey = 'access-token'
const RefreshTokenKey = 'refresh-token'
const CsrfTokenKey = 'XSRF-TOKEN'

export function getAccessToken () {
  return Cookies.get(TokenKey)
}

export function getRefreshToken () {
  return Cookies.get(RefreshTokenKey)
}

export function getCsrfToken() {
  return Cookies.get(CsrfTokenKey)
}
