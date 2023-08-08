<template>
  <n-page :navbarShow="false">
    <view class="user">
      <view class="user-head">
        <u-avatar
          :size="60"
          :src="userInfo.avatar || '/static/userAvatar.jpg'"
        ></u-avatar>
        <view class="u-m-l-40 u-w-200 u-flex-1" v-if="isLogin">
          <view class="nickname">
            {{ userInfo.nickname }}
            <image
              v-if="userInfo.expireTime"
              class="vip"
              src="../../static/vip.png"
              mode=""
            ></image>
            <image
              v-else
              class="vip"
              src="../../static/no_vip.png"
              mode=""
            ></image>
          </view>
          <view class="u-m-t-20 u-font-24 u-content-color" v-html="getTips()"></view>
        </view>
        <view class="u-m-l-40 u-w-200 u-flex-1" @tap="login" v-else>
          <view>登录</view>
          <view class="u-m-t-20 u-font-24 u-content-color"
            >登录即可享受完整体验
          </view>
        </view>
        <view class="u-m-r-40">
          <u-icon
            name="/static/user/black.png"
            v-if="theme == 'dark'"
            color="#000"
            size="20"
            @tap="changeTheme('light')"
          ></u-icon>
          <u-icon
            name="/static/user/white.png"
            v-if="theme == 'light'"
            color="#000"
            size="20"
            @tap="changeTheme('dark')"
          ></u-icon>
        </view>
      </view>
      <view
        class="user-vip u-flex u-flex-between u-flex-y-center"
        v-if="isLogin"
      >
        <view class="user-vip__position--left">
          <view>会员中心</view>
          <view class="u-m-t-20 u-font-24" v-if="userInfo.expireTime">{{
            `到期时间: ${userInfo.expireTime}`
          }}</view>
          <view class="u-m-t-20 u-font-24" v-else>开通会员享权益</view>
        </view>
        <u-button
          customStyle="width: 200rpx;"
          type="primary"
          shape="circle"
          :text="userInfo.expireTime ? '续费会员' : '开通会员'"
          @tap="go('pages/cdk/index')"
        ></u-button>
      </view>
      <view
        class="user-vip u-flex u-flex-between u-flex-y-center"
        v-else
        @tap="login"
      >
        <view class="user-vip__position--left">
          <view>会员中心</view>
          <view class="u-m-t-20 u-font-24 u-content-color"
            >登录查看会员权益</view
          >
        </view>
        <u-button
          customStyle="width: 200rpx;"
          type="primary"
          shape="circle"
          text="开通会员"
        ></u-button>
      </view>
      <view class="u-p-20">
        <u-cell-group>
          <u-cell
            :title="item.title"
            isLink
            :icon="item.icon"
            v-for="item in list"
            :key="item.id"
            @tap="go(item.url)"
          ></u-cell>
        </u-cell-group>
      </view>
      <view class="u-p-20">
        <mp-html
          :content="item.desc"
          v-for="item in ad('4')"
          :key="item.id"
        ></mp-html>
      </view>
    </view>
  </n-page>
</template>

<script>
import { login } from "@/config/login.js";
export default {
  data() {
    return {
      list: [],
      isLogin: false,
    };
  },
  onLoad() {
    this.getList();
  },
  onShow() {
    this.isLogin = uni.getStorageSync("appToken") ? true : false;
    this.isLogin && this.getUserInfo();
  },
  methods: {
    getTips() {
      if (this.userInfo.unlimited === 1) {
        return `不限次数，随心所欲`;
      } else if (this.userInfo.giveFrequency > 0) {
        return `剩余提问次数：${this.userInfo.giveFrequency}次`;
      } else if (
        this.userInfo.totalFrequency > 0 &&
        this.userInfo.frequency > 0
      ) {
        return `每日还可提问${this.userInfo.frequency}次`;
      } else if (
        this.userInfo.totalFrequency > 0 &&
        this.userInfo.frequency === 0
      ) {
        return `今日次数已耗尽,请明日再来!`;
      } else {
        return "您已无免费次数，请开通会员使用～";
      }
    },
    changeTheme(e) {
      this.$store.commit("setTheme", e);
    },
    go(e) {
      this.$login();
      uni.$u.route(e);
    },
    login() {
      login(401);
    },
    async getList() {
      const { data } = await uni.$u.http.post("/app/renovation/user/menu/list");
      this.list = data.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.light .user {
  background-image: url("../../static/user/bg.png");
  background-color: #fff;
}

.user {
  width: 100%;
  background-color: var(--bg);

  background-repeat: no-repeat;
  background-size: 100% 450rpx;

  .nickname {
    display: flex;
    align-items: center;
  }

  .vip {
    margin-left: 20rpx;
    width: 30rpx;
    height: 30rpx;
  }

  &-head {
    /* 顶部背景图 start */
    padding: 20rpx;
    box-sizing: border-box;
    height: 450rpx;
    display: flex;
    align-items: center;
    color: var(--font-black);
  }

  &-vip {
    display: flex;
    margin: 20rpx;
    padding: 20rpx;
    height: 160rpx;
    margin-top: -100rpx;
    border-radius: 20rpx;
    align-items: center;

    background: linear-gradient(-120deg, #3e445a, #31374a, #2b3042, #262b3c);

    &__position--left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 20rpx;
      color: #fff;
      width: 500rpx;
    }
  }

  /deep/.u-cell__title-text {
    color: var(--font-black);
  }
}
</style>
