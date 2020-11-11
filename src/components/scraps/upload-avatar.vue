<template>
  <a-upload
    ref="avatarUpload"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :action="action"
    :headers="{ Authorization: 'Bearer ' + accessToken }"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="onChangeAvatar"
  >
    <div style="position: relative;">
      <a-badge v-if="imageUrl" @click.stop="onCancelAvatar">
        <a-icon type="close-circle" theme="filled" style="color: #f5222d" />
      </a-badge>
      <img v-if="imageUrl" :src="imageUrl" class="avatar-img">
      <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">
          点击上传
        </div>
      </div>
    </div>
  </a-upload>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UploadAvatar',
  props: {
    action: {
      type: String,
      required: true
    },
    defaultImageUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      avatarFile: null
    }
  },
  computed: {
    ...mapState('auth', ['accessToken']),
    imageUrl() {
      return this.defaultImageUrl
    }
  },
  methods: {
    onChangeAvatar({ file, fileList, event }) {
      if (file.status === 'uploading') {
        this.loading = true
        if (this.avatarFile) {
          this.$refs.avatarUpload.handleManualRemove(this.avatarFile)
          this.avatarFile = null
        }
        return
      }
      if (file.status === 'done') {
        this.$emit('update:imageUrl', file.response.url)
        this.loading = false
        this.avatarFile = file
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 200
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJPG && isLt2M
    },
    onCancelAvatar() {
      this.$emit('update:imageUrl', '')
      if (this.avatarFile) {
        this.$refs.avatarUpload.handleManualRemove(this.avatarFile)
        this.avatarFile = null
      }
    }
  }
}
</script>

<style>
.avatar-uploader .avatar-img {
  display: block;
  max-width: 128px;
}

.ant-upload .ant-badge {
  position: absolute;
  right: -5px;
  top: -5px;
}

</style>
