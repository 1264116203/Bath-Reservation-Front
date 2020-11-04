<template>
  <a-spin :tip="tip" size="large">
    <div class="fullscreen"></div>
    <template slot="indicator">
      <a-icon v-if="!gotError" type="loading" style="font-size: 24px" :spin="true" />
      <a-icon v-else type="info-circle" style="font-size: 24px" />
    </template>
  </a-spin>
</template>

<script>
// import { checkAuthenticate } from '@/api/user-account'
// import store from '@/store'

export default {
  name: 'Authenticate',
  data() {
    return {
      tip: '正在验证用户令牌…',
      gotError: false
    }
  },
  computed: {
    authenticated: {
      get() {
        return this.$store.getters.authenticated
      },
      set(val) {
        this.$store.commit('auth/setAuthenticated', val)
      }
    },
    lastPageBeforeLogin() {
      return this.$store.state.user.lastPageBeforeLogin
    },
    token() {
      return this.$store.state.user.token
    }
  },
  created() {
    const doCheck = () => {
      // return checkAuthenticate()
      //   .then((res) => {
      //     const status = res.status
      //     if (status === 401) {
      //       if (res.data && res.data.refreshToken !== 'invalid refresh token') {
      //         return store.dispatch('user/refreshToken').then(doCheck)
      //       } else {
      //         this.authenticated = 'no'
      //         this.$router.push('/login')
      //       }
      //     } else {
      //       this.authenticated = 'yes'
      //       this.$store.commit('user/SET_TOKEN', res.data)
      //       if (this.lastPageBeforeLogin) {
      //         this.$router.push(this.lastPageBeforeLogin)
      //           .then(() => {
      //             this.$store.commit('user/SET_LAST_PAGE_BEFORE_LOGIN', null)
      //           })
      //       } else {
      //         this.$router.push('/login')
      //       }
      //     }
      //   })
      //   .catch(() => {
      //     this.gotError = true
      //     this.tip = '鉴定用户身份时发生了未知异常，似乎没能连接至后端服务！'
      //   })
    }
    doCheck()
  }
}
</script>

<style lang="less" scoped>
  .fullscreen {
    width: 100vw;
    height: 100vh;
  }
</style>
