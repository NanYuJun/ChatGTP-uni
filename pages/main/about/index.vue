<template>
  <view class="container">
    <view class="bg"></view>
    <view class="form">
      <view class="panel" v-for="item in ad('3')" :key="item.id">
        <view class="head">
          <view class="title">{{ item.title }}</view>
        </view>
        <view class="content">
          <mp-html :content="item.desc"></mp-html>
        </view>
        <view class="bottom">
          {{ item.remarks }}
        </view>
      </view>
    </view>
    <tabbar ref="tabBar" />
  </view>
</template>

<script>
import adMixin from "../../../mixins/ad.js";
export default {
  mixins: [adMixin],
  onShow(){
   this.$nextTick(() => {
      this.$refs.tabBar.setTabbar()
    })
  }
};
</script>

<style lang="scss" scoped>
.form {
  width: 90%;
  margin: 0 auto;
  z-index: 999;

  .header {
    margin-bottom: 30rpx;

    .title {
      text-align: center;
      color: #fff;
      margin: 30rpx 0rpx;
    }
  }

  .panel {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 15rpx;
    box-shadow: 0rpx 10rpx 10rpx #eee;
    margin-bottom: 15rpx;

    .bottom {
      font-size: 24rpx;
    }

    .head {
      border-bottom: 1rpx solid #eee;
      padding-bottom: 30rpx;

      .title {
        font-weight: bolder;
        font-size: 30rpx;
      }
    }

    .content {
      margin: 30rpx 0rpx;
    }

    .bottom {
      background-color: #f0faf8;
      color: $uni-color-primary;
      padding: 15rpx;
      border-radius: 10rpx;
    }
  }
}

.bg {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  background-color: $uni-color-primary;
  min-height: 200rpx;
  border-radius: 0rpx 0rpx 140rpx 140rpx;
  z-index: -1;
}
</style>
