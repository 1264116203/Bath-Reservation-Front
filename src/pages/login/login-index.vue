<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-left">
        <div class="login-time">
          {{ time | momentTime('yyyy-MM-DD HH:mm:ss') }}
        </div>
        <img class="img" src="../../assets/login/logo.png">
        <p class="title">
          {{ application.title }}
        </p>
      </div>

      <div class="login-right">
        <div class="login-main">
          <h4 class="login-title">
            {{ application.title }}用户登录
          </h4>
          <user-login/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserLogin from './user-login'
import Application from '@/config/application'
import * as moment from 'moment'

export default {
  name: 'LoginIndex',
  components: { UserLogin },
  props: [],
  data () {
    return {
      time: '',
      activeName: 'user',
      application: Application
    }
  },
  created () {
    this.getTime()
    setInterval(() => {
      this.getTime()
    }, 1000)
  },
  methods: {
    getTime () {
      this.time = moment()
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes animate-cloud {
  from {
    background-position: 600px 100%;
  }
  to {
    background-position: 0 100%;
  }
}

.login-container {
  width: 100%;
  height: 100%;
  background: url("http://www.17sucai.com/preview/242158/2015-01-10/%E7%99%BB%E5%BD%95/images/cloud.jpg") 0 bottom repeat-x #049ec4;
  animation: animate-cloud 20s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-wrapper {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);

    width: 1000px;

    display: flex;
    color: #fff;

    .login-left, .login-right {
      min-height: 500px;
      flex: 1 0;
      display: flex;
    }

    .login-left {
      text-align: center;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      background-color: #409EFF;
      flex-direction: column;
      justify-content: space-between;

      .login-time {
        margin-top: 25px;
        font-weight: 200;
        opacity: 0.9;
        font-size: 18px;
        overflow: hidden;
      }

      img {
        display: block;
        width: 16rem;
        margin: auto;
      }

      .title {
        font-weight: 300;
        letter-spacing: 2px;
        font-size: 25px;
      }
    }

    .login-right {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;

      background-color: #fff;
      align-items: center;

      .login-main {
        margin: 0 auto;
        width: 65%;
        box-sizing: border-box;

        .login-title {
          color: #333;
          margin-bottom: 40px;
          font-weight: 500;
          font-size: 22px;
          text-align: center;
          letter-spacing: 4px;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .login-container {
    .login-wrapper {
      margin: 0 20px;

      .login-left {
        flex-grow: 0;
        display: none !important;
      }

      .login-right {
        flex-basis: 500px;
        border-left: none;
        border-radius: 5px;
      }
    }
  }
}
</style>
