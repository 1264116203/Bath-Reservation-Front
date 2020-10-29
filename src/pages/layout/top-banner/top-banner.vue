<template>
  <div class="top-banner">
    <div class="top-banner-left">
      <span>
        <a-icon v-if="showCollapse"
                class="collapseButton"
                :type="isCollapse ? 'menu-unfold' : 'menu-fold'"
                @click="toggleCollapsed"
        />
      </span>
      <top-menu />
    </div>
    <div class="top-banner-right">
      <div v-if="isDev">
        <demo-menu />
      </div>
      <div>
        <a-tooltip placement="bottom" title="全屏切换">
          <a-button type="link" class="right-button" @click="toggleFullScreenClicked">
            <a-icon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" />
          </a-button>
        </a-tooltip>
      </div>
      <div v-if="wsNotificationEnabled">
        <a-popover v-model="showNewsDropdown" placement="bottomRight">
          <a-button type="link" class="right-button">
            <a-badge :count="newsTotal" :offset="[0, -7]">
              <a-icon type="mail" />
            </a-badge>
          </a-button>
          <notice-popup slot="content" style="width: 700px;" />
        </a-popover>
      </div>

      <div v-if="wsNotificationEnabled">
        <a-tooltip placement="bottom">
          <template slot="title">
            {{ webSocketMsg }}
          </template>
          <a-button type="link" class="right-button">
            <a-icon :type="webSocketState ? 'link' : 'disconnect'" />
          </a-button>
        </a-tooltip>
      </div>

      <div class="pointer avatar-dropdown">
        <a-dropdown>
          <div style="display:inline-block; height: 3rem;">
            <a-avatar v-if="userInfo.avatar" :src="userInfo.avatar" style="margin-right: 0.5rem;" :size="32" />
            <a-avatar v-else icon="user" style="margin-right: 0.5rem;" :size="32" />
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
import website from '@/config/website'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { fullscreenListener, toggleFullscreen } from '@/util/util'
import TopMenu from '@/page/layout/top-menu/top-menu'
import NoticePopup from '@/views/notification/notice-popup'
import DemoMenu from '@/page/demo/demo-menu'

const isDev = process.env.NODE_ENV === 'development'

export default {
  name: 'TopBanner',
  components: { DemoMenu, TopMenu, NoticePopup },
  computed: {
    ...mapState('common', ['isCollapse', 'showCollapse']),
    ...mapGetters(['isFullScreen', 'userInfo']),
    wsNotificationEnabled() {
      return website.wsNotificationEnabled
    },
    webSocketState: {
      get () {
        return this.$store.state.websocket.webSocketState
      }
    },
    isDev () {
      return isDev
    },
    webSocketMsg: {
      get() {
        return this.$store.state.websocket.webSocketMsg
      }
    },
    showNewsDropdown: {
      get() {
        return this.$store.state.notification.dropdownVisible
      },
      set (val) {
        this.$store.commit('notification/SET_DROPDOWN_VISIBLE', val)
      }
    },
    newsTotal: {
      get() {
        return this.$store.state.notification.total
      }
    }
  },
  mounted() {
    fullscreenListener(() => {
      this.TOGGLE_FULLSCREEN()
    })
  },
  methods: {
    ...mapMutations('common', ['TOGGLE_COLLAPSE', 'TOGGLE_FULLSCREEN']),
    ...mapActions('user', ['logout']),
    ...mapActions('tabs', ['navTo']),
    toggleCollapsed() {
      this.TOGGLE_COLLAPSE()
    },
    toggleFullScreenClicked () {
      toggleFullscreen()
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
    },
    doBackHome() {
      this.navTo({
        path: '/main/home',
        meta: {
          isAuth: true,
          isTab: true
        }
      })
    },
    doUserInfo() {
      this.navTo({
        path: '/user/info',
        meta: {
          isAuth: true,
          isTab: true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../custom-variables";

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
        .ant-badge{
          font-size: 18px;
          color: @text-color;
        }
      }

      .avatar-dropdown {
        margin-left: 0.5rem;
        margin-top: -0.125rem;
      }
    }
  }
</style>
