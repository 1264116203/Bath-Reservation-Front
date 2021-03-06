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
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Authenticate',
  data() {
    return {
      tip: '正在验证用户令牌…',
      gotError: false
    }
  },
  computed: {
    ...mapState('auth', ['refreshToken']),
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
    }
  },
  async created() {
    if (!this.refreshToken) {
      this.authenticated = 'no'
      await this.$router.push('/login')
      return
    }
    try {
      const res = await checkAuthenticate()
      const status = res.status
      if (status === 401) {
        // 只有存在refreshToken时，再提交令牌重刷
        const refreshToken = store.state.auth.refreshToken
        if (refreshToken) {
          try {
            await store.dispatch('auth/refreshToken')
          } catch (e) {
            console.error(e)
            this.authenticated = 'no'
            await this.$router.push('/login')
            return
          }
          await this.fetchUserInfoAndGotoLastPageBeforeLogin()
        } else {
          this.authenticated = 'no'
          await this.$router.push('/login')
        }
      } else {
        this.$store.commit('auth/setAccessToken', res.data)
        await this.fetchUserInfoAndGotoLastPageBeforeLogin()
      }
    } catch (err) {
      console.error(err)
      this.gotError = true
      this.authenticated = 'no'
      this.tip = (
        <div>
          <div style="margin-bottom: 1rem;">鉴定用户身份时发生了未知异常，似乎没能连接至后端服务！</div>
          <div>
            <a-button type="primary" icon="arrow-left" onClick={() => this.$router.push('/login')}>
              回登录页
            </a-button>
          </div>
        </div>
      )
    }
  },
  methods: {
    ...mapMutations('auth', ['setUserInfo']),
    async fetchUserInfoAndGotoLastPageBeforeLogin() {
      this.authenticated = 'yes'
      const userInfo = (await getSelfInfo()).data
      this.setUserInfo(userInfo)
      if (this.lastPageBeforeLogin) {
        await this.$router.push(this.lastPageBeforeLogin)
        this.$store.commit('auth/setLastPageBeforeLogin', null)
      } else {
        await this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .fullscreen {
    width: 100vw;
    height: 100vh;
  }
</style>
