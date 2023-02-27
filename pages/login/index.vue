<template>
  <view class="login">
    <!-- 账号密码登录 -->
    <view class="login-account" v-show="type == 'useraccount'">
      <view class="login-account-header">
        <view class="hello">
          <text>Hi，欢迎使用</text>
        </view>
      </view>
      <view class="login-account-content">
        <view class="login-account-content-tip">账号</view>
        <input
          v-model="nickname"
          type="text"
          placeholder="请输入账号"
          placeholder-class="placeholder"
        />
        <view class="login-account-content-tip">密码</view>
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          placeholder-class="placeholder"
        />
        <view class="login-account-content-tip link" @tap="type = 'register'"
          >还没有账号？快去注册吧</view
        >
        <button
          type="button"
          @click="
            login({
              nickname: nickname,
              password: password,
            })
          "
        >
          登录
        </button>
      </view>
    </view>
    <!-- 注册 -->
    <view class="login-account" v-show="type == 'register'">
      <view class="login-account-header">
        <view class="hello">
          <text>Hi，欢迎注册</text>
        </view>
      </view>
      <view class="login-account-content">
        <view class="login-account-content-tip">账号</view>
        <input
          v-model="nickname"
          type="text"
          placeholder="请输入账号"
          placeholder-class="placeholder"
        />
        <view class="login-account-content-tip">密码</view>
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          placeholder-class="placeholder"
        />
        <view class="login-account-content-tip">重复密码</view>
        <input
          v-model="passwordV"
          type="password"
          placeholder="请输入密码"
          placeholder-class="placeholder"
        />
        <view class="login-account-content-tip link" @tap="type = 'useraccount'"
          >已有账号，前往登录</view
        >
        <button type="button" @click="register()">注册</button>
      </view>
    </view>
    <!-- 微信小程序登录 -->
    <view class="login-wechat" v-show="type == 'miniprogram'">
      <!-- 内容区域 -->
      <view class="login-wechat__wrapper">
        <view class="login-wechat__sub-img">
          <image src="/static/login.png"></image>
        </view>
        <!-- 标题 -->
        <view class="login-wechat__title">授权登录</view>
        <!-- tips -->
        <view class="login-wechat__sub-title">
          一键授权登录，完整功能体验
        </view>
        <!-- 保存按钮 -->
        <view class="login-wechat__submit-btn" @tap="getLoginCode">
          一 键 登 录
        </view>
      </view>
    </view>
    <!-- 微信授权头像昵称 -->
    <wx-user-info-modal
      v-model="userInfoShow"
      :currentUserInfo="userInfo"
      @updated="updatedUserInfo"
    />
  </view>
</template>

<script>
import requestConfig from "@/config/request.js";
import WxUserInfoModal from "@/uni_modules/tuniaoui-wx-user-info/components/tuniaoui-wx-user-info/tuniaoui-wx-user-info.vue";

export default {
  data() {
    return {
      type: "",
      nickname: "",
      password: "",
      passwordV: "",
      userInfoShow: false,
      userInfo: {
        avatar: "",
        nickname: "",
      },
    };
  },
  components: {
    WxUserInfoModal,
  },
  onLoad(e) {
    this.type = e.type;
  },
  methods: {
    // 获取code
    getLoginCode() {
      uni.login({
        success: (e) => {
          this.login(e);
        },
      });
    },
    // 注册
    async register() {
      if (this.password != this.passwordV) {
        uni.showToast({
          title: "两次密码不一致",
          icon: "none",
        });
        return;
      }
      const { data } = await uni.$u.http.post("/app/user/info/register", {
        nickname: this.nickname,
        password: this.password,
        passwordV: this.passwordV,
      });
      if (data.code == 1000) {
        uni.showToast({
          title: "注册成功",
          icon: "none",
        });
        this.type = "useraccount";
        this.login({
          nickname: this.nickname,
          password: this.password,
        });
      } else {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
    },
    // 微信登录
    async login(e) {
      uni.showLoading({
        title: "登录中",
      });
      const { data } = await uni.$u.http.post("/app/user/info/login", {
        ...e,
        type: this.type,
      });
      uni.hideLoading();
      if (data.code == 1000) {
        this.userInfo = data.data;
        uni.setStorageSync("token", data.data.token);
        // #ifdef MP-WEIXIN
        if (!this.userInfo.avatar || !this.userInfo.nickname) {
          return (this.userInfoShow = true);
        }
        // #endif
        uni.setStorageSync("userInfo", data.data);
        uni.navigateBack();
      } else {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
    },
    uploadAvatar(e) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: requestConfig.baseURL + "/app/base/comm/upload",
          filePath: e.avatar,
          name: "file",
          success: (res) => {
            const fileData = JSON.parse(res.data);
            if (fileData.code == 1000) {
              resolve(fileData.data);
            } else {
              uni.showToast({
                title: "头像上传失败，请重试～",
                icon: "none",
              });
              throw "头像上传失败，请重试～";
            }
          },
        });
      });
    },
    async updatedUserInfo(e) {
      this.userInfo = {
        ...this.userInfo,
        ...e,
        avatar: await this.uploadAvatar(e),
      };
      const { data } = await uni.$u.http.post(
        "/app/user/info/update",
        this.userInfo
      );
      console.log(data);
      if (data.code == 1000) {
        uni.setStorageSync("userInfo", this.userInfo);
        uni.navigateBack();
      } else {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
    },
  },
};
</script>

<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-account {
    width: 600rpx;

    &-header {
      padding: 200rpx 0 70rpx 0;

      font-weight: bold;

      .hello {
        font-size: 50rpx;
        font-weight: 500;
        display: flex;
        align-items: center;
      }
    }

    &-content {
      input {
        border: 0;
        color: #333;
        line-height: 70rpx;
        border-bottom: 1px solid #dfdee4;
        margin-top: 30rpx;
        padding-bottom: 20rpx;
      }

      .placeholder {
        color: #c0c3cb;
        font-size: 32rpx;
      }

      &-tip {
        font-size: 28rpx;
        margin: 25rpx 0 0 0rpx;
        &.link {
          color: $uni-color-primary;
        }
      }

      button {
        margin-top: 50rpx;
        height: 80rpx;
        background: $uni-color-primary;
        color: #fff;
        border-radius: 45rpx;
        font-size: 32rpx;
        line-height: 80rpx;
      }
    }

    &-footer {
    }
  }

  &-wechat {
    padding: 200rpx 0 0 0;
    width: 600rpx;

    /* title */
    &__title {
      font-size: 34rpx;
    }

    /* sub-title */
    &__sub-title {
      font-size: 26rpx;
      color: #aaaaaa;
      margin-top: 16rpx;
      padding-bottom: 30rpx;
    }

    /* sub-img */
    &__sub-img {
      text-align: center;

      image {
        width: 300rpx;
        height: 300rpx;
      }
    }

    /* 保存按钮 */
    &__submit-btn {
      background-color: $uni-color-primary;
      color: #ffffff;
      margin-top: 30rpx;
      border-radius: 10rpx;
      padding: 25rpx;
      font-size: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &.disabled {
        background-color: #e6e6e6;
      }
    }
  }
}
</style>
