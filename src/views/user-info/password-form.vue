<template>
  <div>
    <a-form ref="form" :form="passwordForm"
            class="width64-centered"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
    >
      <a-form-item label="原密码">
        <a-input-password
          v-decorator="['oldPassword', { rules: [
            { required: true, message: '请输入密码' }
          ]}]"
          placeholder="请输入原密码"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="新密码">
        <a-input-password
          v-decorator="['newPassword', { rules: [
            { required: true, validator: validatePass },
            { pattern:/^(?=.*[0-9a-zA-Z])\w{4,16}$/, message: '必须有数字或者字母并且长度在4~16之间' }
          ]}]"
          placeholder="请输入密码"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="确认密码">
        <a-input-password
          v-decorator="['newPassword1', { rules: [
            { required: true, validator: validatePass2 }
          ]}]"
          placeholder="请再次输入密码"
          allow-clear
        />
      </a-form-item>
      <a-divider />
      <a-form-item class="text-right" :wrapper-col="{ span: 24 }">
        <a-button @click="onCancel">
          清除
        </a-button>
        <a-button type="primary" style="margin-left: 15px" @click="onSubmit">
          提交
        </a-button>
      </a-form-item>
    </a-form>
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
      const password = this.passwordForm.getFieldValue('newPassword')
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordForm: this.$form.createForm(this),
      /** 验证密码 */
      validatePass,
      validatePass2
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    onSubmit() {
      this.passwordForm.validateFields((errors, values) => {
        if (!errors) {
          updatePassword(this.passwordForm.getFieldValue('oldPassword'), this.passwordForm.getFieldValue('newPassword')).then(res => {
            this.$message.success('修改密码成功!')
            this.doLogout()
          })
        } else {
          this.$message.error('校验失败！')
          console.error(errors, values)
        }
      })
    },
    onCancel() {
      this.passwordForm.resetFields()
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
