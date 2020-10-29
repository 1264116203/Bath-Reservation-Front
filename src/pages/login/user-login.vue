<template>
  <a-spin :spinning="spinning">
    <a-form
      @keyup.enter.native="handleLogin"
    >
      <a-form-item prop="username">
        <a-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        >
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-item>
      <a-form-item prop="password">
        <a-input
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        >
          <a-icon slot="suffix" :type="passwordType ? 'eye' : 'eye-invisible'" @click="showPassword" />
          <a-icon slot="prefix" type="lock" />
        </a-input>
      </a-form-item>
      <div>
        <a-button type="primary" block @click.native.prevent="handleLogin">
          提交
        </a-button>
      </div>
    </a-form>
  </a-spin>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

const devUsername = process.env.NODE_ENV === 'development' ? 'admin' : ''
const devPassword = process.env.NODE_ENV === 'development' ? 'admin' : ''

export default {
  name: 'UserLogin',
  props: [],
  data() {
    return {
      spinning: false,
      loginForm: {
        rememberMe: false,
        username: devUsername,
        password: devPassword,
        pwdEncoded: true
      },
      loginRules: {
        tenantId: [
          { required: false, message: '请输入租户ID', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  computed: {
    ...mapGetters(['homepageTab']),
    ...mapState('user', ['lastPageBeforeLogin'])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.spinning = true
      const loginData = {
        ...this.loginForm
      }
      loginData.password = window.btoa(loginData.password)
      this.$store.dispatch('user/loginByUsername', loginData)
        .then(() => {
          this.$router.push(this.lastPageBeforeLogin ? this.lastPageBeforeLogin : { path: this.homepageTab.path })
            .then(() => {
              this.$store.commit('user/SET_LAST_PAGE_BEFORE_LOGIN', null)
            })
        })
        .catch(err => {
          console.error(err)
        })
        .finally(() => {
          this.spinning = false
        })
    }
  }
}
</script>
