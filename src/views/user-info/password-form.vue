<template>
  <div>
    <a-form-model ref="form" :model="formData"
                  :rules="rules"
                  layout="vertical"
                  class="user-info-centered"
    >
      <a-form-model-item label="原密码" prop="oldPassword">
        <a-input-password
          v-model="formData.oldPassword"
          placeholder="请输入原密码"
          allow-clear
        />
      </a-form-model-item>
      <a-form-model-item label="新密码" prop="newPassword">
        <a-input-password
          v-model="formData.newPassword"
          placeholder="请输入密码"
          allow-clear
        />
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="newPasswordAgain">
        <a-input-password
          v-model="formData.newPasswordAgain"
          placeholder="请再次输入密码"
          allow-clear
        />
      </a-form-model-item>
    </a-form-model>
    <a-divider />
    <div class="text-right">
      <a-space>
        <a-button @click="onCancel">
          清除
        </a-button>
        <a-button type="primary" @click="onSubmit">
          提交
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { updatePassword } from '@/api/common/user-self'
import { mapActions } from 'vuex'

export default {
  name: 'PasswordForm',
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      const password = this.formData.newPassword
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入密码' }],
        newPassword: [
          { required: true, validator: validatePass },
          { pattern: /^[a-zA-Z].{5,17}$/, message: '以字母开头，长度在6~18之间' }
        ],
        newPasswordAgain: [{ required: true, validator: validatePass2 }]
      }
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await updatePassword(this.formData.oldPassword, this.formData.newPassword)
          this.$message.success('修改密码成功!')
          this.doLogout()
        } else {
          this.$message.error('校验失败！')
        }
      })
    },
    onCancel() {
      this.$refs.form.resetFields()
    },
    doLogout() {
      this.logout()
        .then(() => {
          this.$router.push('/login')
        })
        .catch(err => {
          this.$message.error('注销失败！')
          console.error(err)
        })
    }
  }
}
</script>

<style>

</style>
