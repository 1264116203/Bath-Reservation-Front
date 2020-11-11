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
import { checkAuthenticate } from '@/api/common/auth'
import store from '@/store'
import { getSelfInfo } from '@/api/common/user-self'
import { mapMutations } from 'vuex'

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
      return this.$store.state.auth.lastPageBeforeLogin
    },
    token() {
      return this.$store.state.auth.token
    }
  },
  async created() {
    try {
      const res = await checkAuthenticate()
      const status = res.status
      if (status === 401) {
        if (res.data && res.data.refreshToken !== 'invalid refresh token') {
          try {
            await store.dispatch('auth/refreshToken')
            this.authenticated = 'yes'
            if (this.lastPageBeforeLogin) {
              await this.$router.push(this.lastPageBeforeLogin)
              this.$store.commit('auth/setLastPageBeforeLogin', null)
            } else {
              await this.$router.push('/')
            }
          } catch (e) {
            console.error(e)
            this.authenticated = 'no'
            await this.$router.push('/login')
          }
        } else {
          this.authenticated = 'no'
          await this.$router.push('/login')
        }
      } else {
        this.authenticated = 'yes'
        this.$store.commit('auth/setAccessToken', res.data)
        const userInfo = (await getSelfInfo()).data
        this.setUserInfo(userInfo)
        if (this.lastPageBeforeLogin) {
          await this.$router.push(this.lastPageBeforeLogin)
          this.$store.commit('auth/setLastPageBeforeLogin', null)
        } else {
          await this.$router.push('/')
        }
      }
    } catch (err) {
      console.error(err)
      this.gotError = true
      this.tip = '鉴定用户身份时发生了未知异常，似乎没能连接至后端服务！'
    }
  },
  methods: {
    ...mapMutations('auth', ['setUserInfo'])
  }
}
</script>

<style lang="less" scoped>
  .fullscreen {
    width: 100vw;
    height: 100vh;
  }
</style>
