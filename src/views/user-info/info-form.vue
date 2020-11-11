<template>
  <div>
    <a-form ref="form" :form="form"
            class="width64-centered"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="头像">
        <upload-avatar :action="action" :image-url.sync="imageUrl" :default-image-url="imageUrl" />
      </a-form-item>
      <a-form-item label="姓名">
        <a-input
          v-decorator="['realName', { rules: [
            { required: true, message: '请输入用户姓名' }
          ]}]"
          placeholder="请输入用户真实姓名"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户名（昵称）">
        <a-input
          v-decorator="['name', { rules: [
            { required: true, message: '请输入用户名' }
          ]}]"
          placeholder="请输入用户名（昵称）"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="手机号">
        <a-input
          v-decorator="['phone', { rules: [
            { pattern:/^1[0-9]{10}$/, message: '请输入以1开头的11位手机号码'}
          ]}]"
          placeholder="请输入手机号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input
          v-decorator="['email', { rules: [
            { pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' }
          ]}]"
          placeholder="请输入电子邮箱"
          type="email"
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
import { getSelfInfo, updateSelfInfo } from '@/api/common/user-self'
import UploadAvatar from '@/components/scraps/upload-avatar'

export default {
  name: 'InfoForm',
  components: {
    UploadAvatar
  },
  data() {
    return {
      form: this.$form.createForm(this),
      currentId: '',
      imageUrl: '',
      action: '/api/upload?subPath=avatar'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onSubmit() {
      this.form.validateFields(async (errors, values) => {
        if (!errors) {
          const formData = {
            ...this.form.getFieldsValue(),
            avatar: this.imageUrl,
            id: this.currentId
          }
          await updateSelfInfo(formData)
          this.$store.commit('auth/setUserInfo', (await getSelfInfo()).data)
          this.$message.success('修改信息成功!')
        } else {
          this.$message.error('校验失败！')
          console.error(errors, values)
        }
      })
    },
    onCancel() {
      this.form.resetFields()
    },
    fetchData() {
      getSelfInfo().then(res => {
        const user = res.data
        this.currentId = user.id
        this.form.setFieldsValue({
          name: user.name,
          realName: user.realName,
          phone: user.phone,
          email: user.email
        })
        this.imageUrl = user.avatar
      })
    }
  }
}
</script>

<style>

</style>
