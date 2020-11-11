<template>
  <div>
    <a-tabs default-active-key="info">
      <a-tab-pane key="info" tab="个人信息">
        <info-form />
      </a-tab-pane>
      <a-tab-pane key="password" tab="修改密码">
        <password-form />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import InfoForm from './info-form'
import PasswordForm from './password-form'

export default {
  name: 'UserInfo',
  components: {
    InfoForm,
    PasswordForm
  }
}
</script>

<style>
</style>
