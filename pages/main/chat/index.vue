<template>
  <view class="chat">
    <view class="chat-item">
      <u-transition :show="true" mode="fade-left">
        <view class="chat-item__left u-flex">
          <u-avatar src="../../../static/avatar.jpeg" shape="square"></u-avatar>
          <view class="chat-item__left-right">
            <view class="chat-item__left-name"> ChatGPT </view>
            <view class="chat-item__left-bottom">
              <view class="chat-item__left-message">
                我是智能机器人ChatGPT,开始你的提问吧！
              </view>
            </view>
          </view>
        </view>
      </u-transition>
    </view>
    <view class="chat-item" v-for="(item, index) in chat" :key="index">
      <u-transition :show="true" mode="fade-right" v-if="item.problem">
        <view class="chat-item__right">
          <view class="chat-item__right-message" @longtap="copy(item.problem)">
            {{ item.problem }}
          </view>
          <u-avatar shape="square" :mp-avatar="true"></u-avatar>
        </view>
      </u-transition>
      <u-transition :show="true" mode="fade-left">
        <view class="chat-item__left u-flex">
          <u-avatar src="../../../static/avatar.jpeg" shape="square"></u-avatar>
          <view class="chat-item__left-right">
            <view class="chat-item__left-name"> ChatGPT </view>
            <view class="chat-item__left-bottom">
              <view
                class="chat-item__left-message"
                @longtap="copy(item.answer)"
              >
                <text v-show="item.answer == 'error'">网路错误</text>
                <text v-show="item.answer != 'error'">
                  {{ item.answer || "思考中..." }}</text
                >
              </view>
              <u-loading-icon v-show="item.answer == ''"></u-loading-icon>
              <u-icon v-show="item.answer == 'error'" name="error"></u-icon>
              <view style="margin-top:auto;">
                <u-icon
                  v-show="item.answer && item.answer != error"
                  @tap="copy(item.answer)"
                  name="file-text"
                ></u-icon>
              </view>
            </view>
          </view>
        </view>
      </u-transition>
    </view>
     <view style="height:100rpx"></view>
    <view class="send">
      <u--input
        placeholder="请输入内容"
        border="surround"
        v-model="problem"
      ></u--input>
      <u-button
        iconColor="#ffffff"
        color="#26B3A0"
        text="发送"
        @tap="getAnswer"
      >
      </u-button>
    </view>
  </view>
</template>

<script>
import chatMixin from "../../../mixins/chat.js";
export default {
  mixins: [chatMixin],
  data() {
    return {
      type: "chat",
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  padding: 20rpx;
  box-sizing: border-box;

  &-item {
    &__left {
      display: flex;
      margin-top: 20rpx;

      &-right {
        margin-left: 20rpx;
      }

      &-name {
        font-size: 24rpx;
      }

      &-message {
        margin-top: 10rpx;
        background: #26b3a0;
        padding: 20rpx;
        border-radius: 10rpx;
        font-size: 28rpx;
        color: #fff;
        margin-right: 20rpx;
      }

      &-bottom {
        display: flex;
      }
    }

    &__right {
      display: flex;
      margin-top: 20rpx;
      justify-content: flex-end;

      &-message {
        margin-right: 20rpx;
        background: #f6f6f6;
        padding: 20rpx;
        border-radius: 10rpx;
        font-size: 28rpx;
      }
    }
  }
}

.send {
  display: flex;
  background: #fff;
  position: fixed;
  height: 100rpx;
  bottom: var(--window-bottom,0);
  left: 0;
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  justify-content: space-between;

  .u-input {
    width: 600rpx;
    height: 54rpx;
  }

  .u-button {
    margin-left: 20rpx;
    width: 100rpx;
    height: 80rpx;
  }
}
</style>
