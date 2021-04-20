<template>
  <div class="top-banner">
    <div class="top-banner-left">
      <span>
        <a-tooltip placement="bottom" title="切换菜单折叠">
          <a-icon v-if="showCollapse"
                  class="collapseButton"
                  :type="isCollapse ? 'menu-unfold' : 'menu-fold'"
                  @click="onToggleCollapse"
          />
        </a-tooltip>
      </span>
      <top-menu />
    </div>
    <div class="top-banner-right">
      <div>
        <a-tooltip placement="bottom" title="全屏切换">
          <a-icon class="right-button"
                  :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'"
                  @click="onToggleFullScreen"
          />
        </a-tooltip>
      </div>

      <div class="pointer avatar-dropdown">
        <a-dropdown>
          <div style="display:inline-block; height: 3rem;">
            <a-avatar v-if="userInfo.avatar" :src="userInfo.avatar" class="top-banner-avatar" :size="32" />
            <a-avatar v-else :size="32" class="top-banner-avatar">
              {{ userInfo.name }}
            </a-avatar>
            <a-icon type="down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item @click="doBackHome">
              首页
            </a-menu-item>
            <a-menu-item @click="doUserInfo">
              个人信息
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="doLogout">
              退出登录
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { fullscreenListener, toggleFullscreen } from '@/util/utils'
import TopMenu from './top-menu'
export default {
  name: 'TopBanner',
  components: {
    TopMenu
  },
  computed: {
    ...mapState('common', ['isCollapse', 'isFullScreen', 'showCollapse']),
    ...mapState('auth', ['userInfo']),
    isDev () {
      return process.env.NODE_ENV === 'development'
    }
  },
  mounted () {
    fullscreenListener(() => {
      this.toggleFullScreen()
    })
  },
  methods: {
    ...mapMutations('common', ['toggleCollapse', 'toggleFullScreen']),
    ...mapActions('auth', ['logout']),
    onToggleCollapse () {
      this.toggleCollapse()
    },
    onToggleFullScreen () {
      toggleFullscreen()
    },
    doLogout () {
      this.logout()
        .then(() => {
          this.$router.push('/login')
        })
    },
    doBackHome () {
      this.$router.push('/main/home')
    },
    doUserInfo () {
      this.$router.push('/user/info')
    }
  }
}
</script>

<style lang="less" scoped>
.pointer {
  cursor: pointer;
}

.top-banner {
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;

  .top-banner-left {
    display: inline-flex;
    justify-items: center;
    flex: 1 1;
    overflow-x: hidden;

    .collapseButton {
      margin: 0 1rem;
      font-size: 1.2rem;
    }

    .quick-action {
      margin-left: 2em;
      margin-top: -0.125rem;
    }
  }

  .top-banner-right {
    display: inline-flex;
    justify-items: center;

    .right-button {
      font-size: 18px;
      color: @text-color;
      padding: 0 0.5rem;

      .ant-badge {
        font-size: 18px;
        color: @text-color;
      }
    }

    .avatar-dropdown {
      margin-left: 0.5rem;
      margin-top: -0.125rem;
    }

    .top-banner-avatar {
      margin-right: 0.5rem;
      background-color: @primary-color;
    }
  }
}
</style>
