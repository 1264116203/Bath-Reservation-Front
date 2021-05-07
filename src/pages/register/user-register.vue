<template>
  <a-spin :spinning="spinning">
    <a-form-model
      ref="formRef"
      :model="formData"
      :rules="loginRules"
      layout="horizontal"
      @keyup.enter.native="handleLogin"
    >
      用户名：
      <a-form-model-item prop="account">
        <a-input
          v-model="formData.account"
          placeholder="请设置用户名"
          auto-complete="off"
        >
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-model-item>
      手机号：
      <a-form-model-item prop="phone">
        <a-input
          v-model="formData.phone"
          placeholder="请设置手机号"
          auto-complete="off"
        >
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-model-item>

      密码：
      <a-form-model-item prop="password">
        <a-input
          v-model="formData.password"
          :type="passwordType"
          placeholder="请设置密码"
          auto-complete="off"
        >
          <a-icon slot="suffix" :type="passwordType ? 'eye' : 'eye-invisible'" @click="showPassword" />
          <a-icon slot="prefix" type="lock" />
        </a-input>
      </a-form-model-item>
      <!--<a-form-model-item prop="refreshTokenValidHours"
                         label="令牌有效期"
                         :label-col="{ span: 6 }"
                         :wrapper-col="{ span:18 }"
      >
        <a-select
          v-model="formData.refreshTokenValidHours"
        >
          <a-select-option :value="6">6小时</a-select-option>
          <a-select-option :value="24">24小时</a-select-option>
          <a-select-option :value="24 * 7">1星期</a-select-option>
          <a-select-option :value="24 * 7 * 30">1个月</a-select-option>
        </a-select>
      </a-form-model-item>-->
      <div>
        <a-button type="primary" block @click.native.prevent="handleRegister">
          提交
        </a-button>
      </div>
    </a-form-model>
  </a-spin>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import application from '@/config/application'
import { add } from '@/api/system/user-management'

export default {
  name: 'UserRegister',
  props: [],
  data() {
    return {
      spinning: false,
      formData: {
        account: '',
        password: '',
        name: '普通用户',
        realName: '普通用户',
        email: '111@qq.com',
        phone: '11111111111',
        roleIdList: ['roleIdList'],
        deptIdList: ['dept-1'],
        refreshTokenValidHours: 24,
        pwdEncoded: application.pwdEncoded
      },
      loginRules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone: [{ pattern: /^1[0-9]{10}$/, message: '请输入以1开头的11位手机号码' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  computed: {
    ...mapState('auth', ['lastPageBeforeLogin'])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    ...mapActions('auth', ['loginByPassword']),
    ...mapMutations('auth', ['setLastPageBeforeLogin']),
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleRegister() {
      this.spinning = true
      this.$refs.formRef.validate(async valid => {
        if (!valid) {
          this.spinning = false
          return false
        }
        const registerData = {
          ...this.formData
        }
        if (registerData.pwdEncoded) {
          registerData.password = btoa(registerData.password)
        }
        try {
          // 先登录，登录成功后跳转至登录前想访问的路由
          // await this.loginByPassword(registerData)
          // await this.add()
          await add(registerData).then(res => {
            this.$message.success('注册成功！')
            this.$router.push('/login')
          })
        } catch (ex) {
          console.error(ex)
        }

        this.spinning = false
      })
    },
    async jumpToLastPageBeforeLogin() {
      await this.$router.push(this.lastPageBeforeLogin ? this.lastPageBeforeLogin : { path: '/' })
      this.setLastPageBeforeLogin(null)
    }
  }
}
</script>
