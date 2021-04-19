<template>
  <div>
    <a-form-model ref="form" :model="formData"
                  :rules="rules"
                  layout="vertical"
                  class="user-info-centered"
    >
      <a-form-model-item label="头像">
        <upload-avatar :action="action" :image-url.sync="imageUrl" :default-image-url="imageUrl" />
      </a-form-model-item>
      <a-form-model-item label="姓名" prop="realName">
        <a-input
          v-model="formData.realName"
          v-decorator="['realName', { rules: [
            { required: true, message: '请输入用户姓名' }
          ]}]"
          placeholder="请输入用户真实姓名"
          allow-clear
        />
      </a-form-model-item>
      <a-form-model-item label="用户名（昵称）" prop="name">
        <a-input
          v-model="formData.name"
          placeholder="请输入用户名（昵称）"
          allow-clear
        />
      </a-form-model-item>
      <a-form-model-item label="手机号" prop="phone">
        <a-input
          v-model="formData.phone"
          placeholder="请输入手机号"
          allow-clear
        />
      </a-form-model-item>
      <a-form-model-item label="邮箱" prop="email">
        <a-input
          v-model="formData.email"
          placeholder="请输入电子邮箱"
          type="email"
          allow-clear
        />
      </a-form-model-item>
    </a-form-model>
    <a-divider />
    <div class="text-right">
      <a-space>
        <a-button @click="onCancel">
          清空
        </a-button>
        <a-button type="primary" @click="onSubmit">
          提交
        </a-button>
      </a-space>
    </div>
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
      formData: {
        realName: '',
        name: '',
        phone: '',
        email: ''
      },
      currentId: '',
      imageUrl: '',
      action: '/api/upload?subPath=avatar',
      rules: {
        realName: [{ required: true, message: '请输入用户姓名' }],
        name: [{ required: true, message: '请输入用户名' }],
        phone: [{ pattern: /^1[0-9]{10}$/, message: '请输入以1开头的11位手机号码' }],
        email: [{ pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const formData = {
            ...this.formData,
            avatar: this.imageUrl,
            id: this.currentId
          }
          await updateSelfInfo(formData)
          this.$store.commit('auth/setUserInfo', (await getSelfInfo()).data)
          this.$message.success('修改信息成功!')
        } else {
          this.$message.error('校验未通过！')
          return false
        }
      })
    },
    onCancel() {
      this.$refs.form.resetFields()
    },
    fetchData() {
      getSelfInfo().then(res => {
        const user = res.data
        this.currentId = user.id
        this.formData = {
          name: user.name,
          realName: user.realName,
          phone: user.phone,
          email: user.email
        }
        this.imageUrl = user.avatar || ''
      })
    }
  }
}
</script>

<style>

</style>
